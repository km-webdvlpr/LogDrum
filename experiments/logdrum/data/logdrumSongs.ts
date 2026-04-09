import songsData from '../../../src/data/songs.json'
import type { Song } from '../../../src/types/wela'
import type { LogDrumSongProfile } from '../types/logdrum'

type SongSeed = Omit<LogDrumSongProfile, 'id' | 'title' | 'year' | 'artists'> & {
  songId: string
}

const songs = songsData as Song[]
const songsById = new Map(songs.map((song) => [song.id, song]))

const seeds: SongSeed[] = [
  {
    songId: 'emcimbini',
    aliases: [],
    primaryArtistId: 'kabza',
    producerIds: ['kabza', 'maphorisa', 'myztro'],
    vocalistIds: ['aymos', 'samthing-soweto'],
    camps: ['scorpion-kings', 'festival-piano'],
    tags: ['anthem', 'festival', 'singalong'],
    difficulty: 'standard',
    editorialWeight: 10,
    clueLadder: [
      {
        kind: 'pulse',
        mode: 'text',
        label: 'Pulse',
        body: 'Big-room piano momentum with a vocal lift built for a public singalong.',
        cueRef: 'pulse/emcimbini-intro',
      },
      {
        kind: 'scene',
        mode: 'text',
        label: 'Scene',
        body: 'This lives more in celebration energy than in a deep late-night corner.',
      },
      {
        kind: 'credits',
        mode: 'text',
        label: 'Credits',
        body: 'Kabza and Maphorisa are central, with Aymos and Samthing Soweto on the record.',
      },
      {
        kind: 'reveal',
        mode: 'text',
        label: 'Reveal',
        body: 'The title points directly to a gathering, function, or celebration.',
      },
    ],
    revealNote:
      'A clean example of Amapiano becoming a crowd ritual instead of just a private headphone moment.',
  },
  {
    songId: 'adiwele',
    aliases: [],
    primaryArtistId: 'young-stunna',
    producerIds: ['kabza', 'maphorisa'],
    vocalistIds: ['young-stunna'],
    camps: ['scorpion-kings', 'vocal-piano'],
    tags: ['anthem', 'romantic', 'radio'],
    difficulty: 'standard',
    editorialWeight: 10,
    clueLadder: [
      {
        kind: 'pulse',
        mode: 'text',
        label: 'Pulse',
        body: 'Warm keys, patient swing, and a vocal that turned into a national singalong.',
        cueRef: 'pulse/adiwele-hook',
      },
      {
        kind: 'scene',
        mode: 'text',
        label: 'Scene',
        body: 'This sits in the love-anthem lane, not in the roughest sgija pocket.',
      },
      {
        kind: 'credits',
        mode: 'text',
        label: 'Credits',
        body: 'Young Stunna rides over Scorpion Kings production.',
      },
      {
        kind: 'reveal',
        mode: 'text',
        label: 'Reveal',
        body: 'The answer became one of the clearest mainstream Amapiano hooks of its year.',
      },
    ],
    revealNote:
      'This is the kind of record that proved how emotional, accessible, and still rooted Amapiano could be.',
  },
  {
    songId: 'mnike',
    aliases: [],
    primaryArtistId: 'tyler-icu',
    producerIds: ['tyler-icu', 'maphorisa'],
    vocalistIds: ['sir-trill', 'tumelo-za'],
    camps: ['radio-crossover', 'festival-piano'],
    tags: ['anthem', 'crossover', '2023'],
    difficulty: 'standard',
    editorialWeight: 9,
    clueLadder: [
      {
        kind: 'pulse',
        mode: 'text',
        label: 'Pulse',
        body: 'Bright lift, quick grip, and a hook that escaped the genre bubble fast.',
        cueRef: 'pulse/mnike-hook',
      },
      {
        kind: 'scene',
        mode: 'text',
        label: 'Scene',
        body: 'This was one of the most obvious crossover Amapiano moments of 2023.',
      },
      {
        kind: 'credits',
        mode: 'text',
        label: 'Credits',
        body: 'Tyler ICU, Sir Trill, Tumelo ZA, and DJ Maphorisa all appear on the credit line.',
      },
      {
        kind: 'reveal',
        mode: 'text',
        label: 'Reveal',
        body: 'The answer became shorthand for a massive 2023 piano wave.',
      },
    ],
    revealNote:
      'A reminder that a daily pick can be huge and still feel fair if the clue ladder is precise.',
  },
  {
    songId: 'khuza-gogo',
    aliases: [],
    primaryArtistId: 'dbn-gogo',
    producerIds: ['mellow-sleazy'],
    vocalistIds: [],
    camps: ['sgija', 'club-floor'],
    tags: ['club', 'chant', 'mischief'],
    difficulty: 'expert',
    editorialWeight: 8,
    clueLadder: [
      {
        kind: 'pulse',
        mode: 'text',
        label: 'Pulse',
        body: 'Minimal, unruly club energy with a chant-like line carrying the mischief.',
        cueRef: 'pulse/khuza-gogo-groove',
      },
      {
        kind: 'scene',
        mode: 'text',
        label: 'Scene',
        body: 'This is rowdy floor energy, not polished radio piano.',
      },
      {
        kind: 'credits',
        mode: 'text',
        label: 'Credits',
        body: 'DBN Gogo and Mellow & Sleazy sit at the center of this one.',
      },
      {
        kind: 'reveal',
        mode: 'text',
        label: 'Reveal',
        body: 'The title sounds like calling an elder over just before the room loses control.',
      },
    ],
    revealNote:
      'This is the kind of daily pick that rewards club memory and texture, not just chart recall.',
  },
  {
    songId: 'izolo',
    aliases: [],
    primaryArtistId: 'maphorisa',
    producerIds: ['maphorisa', 'kabza', 'mellow-sleazy'],
    vocalistIds: [],
    camps: ['sgija', 'scorpion-kings'],
    tags: ['street', 'late-night', 'pressure'],
    difficulty: 'expert',
    editorialWeight: 9,
    clueLadder: [
      {
        kind: 'pulse',
        mode: 'text',
        label: 'Pulse',
        body: 'Rougher pressure, darker swing, and more log-drum insistence than glossy piano wash.',
        cueRef: 'pulse/izolo-core',
      },
      {
        kind: 'scene',
        mode: 'text',
        label: 'Scene',
        body: 'This belongs in the sgija lane, not the soft romantic lane.',
      },
      {
        kind: 'credits',
        mode: 'text',
        label: 'Credits',
        body: 'DJ Maphorisa, Kabza De Small, and Mellow & Sleazy all share the billing.',
      },
      {
        kind: 'reveal',
        mode: 'text',
        label: 'Reveal',
        body: 'The title points backward in time: yesterday.',
      },
    ],
    revealNote:
      'A good daily answer should sometimes reward people who know where the sound hardened and shifted.',
  },
  {
    songId: 'abalele',
    aliases: [],
    primaryArtistId: 'ami-faku',
    producerIds: ['kabza', 'maphorisa'],
    vocalistIds: ['ami-faku'],
    camps: ['scorpion-kings', 'vocal-piano'],
    tags: ['emotional', 'vocal', 'polished'],
    difficulty: 'standard',
    editorialWeight: 9,
    clueLadder: [
      {
        kind: 'pulse',
        mode: 'text',
        label: 'Pulse',
        body: 'Silky emotional vocal work over polished piano architecture.',
        cueRef: 'pulse/abalele-vocal',
      },
      {
        kind: 'scene',
        mode: 'text',
        label: 'Scene',
        body: 'This is intimate Scorpion Kings territory, not a rough club-first cut.',
      },
      {
        kind: 'credits',
        mode: 'text',
        label: 'Credits',
        body: 'Ami Faku fronts it, with Kabza and Maphorisa behind the production.',
      },
      {
        kind: 'reveal',
        mode: 'text',
        label: 'Reveal',
        body: 'The answer title hints at people being asleep.',
      },
    ],
    revealNote:
      'This is a strong example of how vocal clarity can define a round just as much as drum identity.',
  },
  {
    songId: 'abo-mvelo',
    aliases: [],
    primaryArtistId: 'daliwonga',
    producerIds: ['mellow-sleazy'],
    vocalistIds: ['daliwonga'],
    camps: ['sgija', 'vocal-piano'],
    tags: ['street', 'vocal', 'sly'],
    difficulty: 'expert',
    editorialWeight: 8,
    clueLadder: [
      {
        kind: 'pulse',
        mode: 'text',
        label: 'Pulse',
        body: 'Loose swing, sly movement, and a vocalist who glides instead of overpowering the groove.',
        cueRef: 'pulse/abo-mvelo-groove',
      },
      {
        kind: 'scene',
        mode: 'text',
        label: 'Scene',
        body: 'This leans street-facing and slippery, not glossy festival anthem.',
      },
      {
        kind: 'credits',
        mode: 'text',
        label: 'Credits',
        body: 'Daliwonga rides in the Mellow & Sleazy orbit here.',
      },
      {
        kind: 'reveal',
        mode: 'text',
        label: 'Reveal',
        body: 'The title opens with the word "Abo".',
      },
    ],
    revealNote:
      'This is the sort of answer that rewards players who know vocalist texture, not only massive hooks.',
  },
  {
    songId: 'sukakude',
    aliases: [],
    primaryArtistId: 'kabza',
    producerIds: ['kabza', 'maphorisa'],
    vocalistIds: ['aymos', 'nkosazana-daughter'],
    camps: ['scorpion-kings', 'vocal-piano'],
    tags: ['emotional', 'duet', 'distance'],
    difficulty: 'expert',
    editorialWeight: 8,
    clueLadder: [
      {
        kind: 'pulse',
        mode: 'text',
        label: 'Pulse',
        body: 'Smooth emotional piano with a male-female vocal contrast at the center.',
        cueRef: 'pulse/sukakude-vocal',
      },
      {
        kind: 'scene',
        mode: 'text',
        label: 'Scene',
        body: 'This is richer and more mature than a quick breakout anthem.',
      },
      {
        kind: 'credits',
        mode: 'text',
        label: 'Credits',
        body: 'Kabza, Maphorisa, Aymos, and Nkosazana Daughter all appear on the record.',
      },
      {
        kind: 'reveal',
        mode: 'text',
        label: 'Reveal',
        body: 'The title suggests distance rather than closeness.',
      },
    ],
    revealNote:
      'The right daily mix should include songs that reward emotional memory, not only brute familiarity.',
  },
]

export const logDrumSongProfiles: LogDrumSongProfile[] = seeds.map((seed) => {
  const song = songsById.get(seed.songId)

  if (!song) {
    throw new Error(`Missing song data for LogDrum profile: ${seed.songId}`)
  }

  return {
    ...seed,
    id: song.id,
    title: song.title,
    year: song.year,
    artists: song.artists,
  }
})
