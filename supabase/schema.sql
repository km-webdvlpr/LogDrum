create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  streak integer not null default 0,
  best_streak integer not null default 0,
  credits integer not null default 0,
  total_solves integer not null default 0,
  total_plays integer not null default 0,
  is_admin boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.songs (
  song_id text primary key,
  song_title text not null,
  primary_artist text not null,
  featured_artists text[] not null default '{}',
  year integer not null,
  mood text not null,
  substyle text not null,
  tempo_band text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  title_length integer not null,
  spotify_id text not null default '',
  youtube_url text not null default '',
  insight_story text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.daily_challenges (
  challenge_date date primary key,
  song_id text not null references public.songs(song_id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.game_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  challenge_date date not null,
  song_id text not null references public.songs(song_id) on delete cascade,
  guess_text text not null,
  guess_index integer not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, challenge_date, guess_index)
);

create table if not exists public.game_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  challenge_date date not null,
  song_id text not null references public.songs(song_id) on delete cascade,
  won boolean not null,
  attempts_used integer not null,
  credits_awarded integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, challenge_date)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create or replace function public.record_game_result(
  p_user_id uuid,
  p_challenge_date date,
  p_song_id text,
  p_won boolean,
  p_attempts_used integer,
  p_credits_awarded integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles%rowtype;
  v_last_result_date date;
  v_next_streak integer;
  v_existing_result_id uuid;
begin
  select id
  into v_existing_result_id
  from public.game_results
  where user_id = p_user_id
    and challenge_date = p_challenge_date;

  insert into public.game_results (
    user_id,
    challenge_date,
    song_id,
    won,
    attempts_used,
    credits_awarded
  )
  values (
    p_user_id,
    p_challenge_date,
    p_song_id,
    p_won,
    p_attempts_used,
    p_credits_awarded
  )
  on conflict (user_id, challenge_date) do update
  set won = excluded.won,
      attempts_used = excluded.attempts_used,
      credits_awarded = excluded.credits_awarded;

  select *
  into v_profile
  from public.profiles
  where id = p_user_id
  for update;

  select max(challenge_date)
  into v_last_result_date
  from public.game_results
  where user_id = p_user_id
    and challenge_date < p_challenge_date;

  if p_won then
    if v_last_result_date = p_challenge_date - interval '1 day' then
      v_next_streak = coalesce(v_profile.streak, 0) + 1;
    else
      v_next_streak = 1;
    end if;
  else
    v_next_streak = 0;
  end if;

  update public.profiles
  set streak = v_next_streak,
      best_streak = greatest(best_streak, v_next_streak),
      credits = credits + case when v_existing_result_id is null then p_credits_awarded else 0 end,
      total_solves = total_solves + case when v_existing_result_id is null and p_won then 1 else 0 end,
      total_plays = total_plays + case when v_existing_result_id is null then 1 else 0 end
  where id = p_user_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.songs enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.game_attempts enable row level security;
alter table public.game_results enable row level security;

create policy "profiles read own record"
on public.profiles
for select
using (auth.uid() = id);

create policy "admins read all profiles"
on public.profiles
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);

create policy "profiles update own record"
on public.profiles
for update
using (auth.uid() = id);

create policy "songs readable by everyone"
on public.songs
for select
using (true);

create policy "songs writable by admins"
on public.songs
for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);

create policy "daily challenges readable by everyone"
on public.daily_challenges
for select
using (true);

create policy "daily challenges writable by admins"
on public.daily_challenges
for all
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);

create policy "players read own attempts"
on public.game_attempts
for select
using (auth.uid() = user_id);

create policy "admins read all attempts"
on public.game_attempts
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);

create policy "players insert own attempts"
on public.game_attempts
for insert
with check (auth.uid() = user_id);

create policy "players read own results"
on public.game_results
for select
using (auth.uid() = user_id);

create policy "admins read all results"
on public.game_results
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.is_admin = true
  )
);

grant execute on function public.record_game_result(uuid, date, text, boolean, integer, integer) to authenticated;
