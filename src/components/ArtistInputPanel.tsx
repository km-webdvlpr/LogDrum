import { useState, type FormEvent } from 'react'
import type { AppCopy } from '../content/copy'

interface ArtistInputPanelProps {
  currentArtist: string
  targetArtist: string
  disabled: boolean
  copy: AppCopy
  onSubmit: (value: string) => void
}

export function ArtistInputPanel({
  currentArtist,
  targetArtist,
  disabled,
  copy,
  onSubmit,
}: ArtistInputPanelProps) {
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!value.trim() || disabled) return
    onSubmit(value)
    setValue('')
  }

  return (
    <section className="rounded-[4px] border border-[#8A6510] bg-[#0F1A0D] px-4 py-4">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F5C842]">
          {copy.cabinet.inputPanel}
        </p>
        <p className="mt-2 text-sm leading-6 text-[#F0EAD0]">{copy.input.subtitle}</p>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-[4px] border border-[#1C3018] bg-[#0A0E09] px-3 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89E80]">
            {copy.input.currentArtist}
          </p>
          <p className="mt-2 font-title text-lg text-[#2EFF7A]">{currentArtist}</p>
        </div>
        <div className="rounded-[4px] border border-[#8A6510] bg-[#0A0E09] px-3 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89E80]">
            {copy.input.targetArtist}
          </p>
          <p className="mt-2 font-title text-lg text-[#F5C842]">{targetArtist}</p>
        </div>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-[#A89E80]">
            {copy.input.title}
          </span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
            placeholder={copy.input.placeholder}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-[3px] border border-[#00B050] bg-[#0A0E09] px-3 py-3 font-mono text-base text-[#2EFF7A] outline-none transition-shadow placeholder:text-[#3D7F50] focus:shadow-[0_0_0_1px_rgba(46,255,122,0.4),0_0_18px_rgba(46,255,122,0.18)] disabled:border-[#1C3018] disabled:text-[#5F674E]"
          />
        </label>

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-[3px] border border-[#8A6510] bg-[#1A1408] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F5C842] transition-colors hover:border-[#F5C842] disabled:border-[#3C3420] disabled:text-[#7D734F]"
        >
          {copy.input.submit}
        </button>
      </form>

      <p className="mt-4 text-xs leading-5 text-[#A89E80]">{copy.input.hint}</p>
    </section>
  )
}
