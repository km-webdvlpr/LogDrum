import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4A017',
        'gold-bright': '#F5C842',
        'gold-dim': '#8A6510',
        green: '#00B050',
        'green-bright': '#2EFF7A',
        'green-dim': '#004D24',
        panel: '#0F1A0D',
        bg: '#0A0E09',
        cream: '#F0EAD0',
        haze: '#A89E80',
        ink: '#F0EAD0',
        ember: '#E03030',
        coal: '#162413',
        paper: '#0F1A0D',
      },
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],
        title: ['"Black Han Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        score: ['"Orbitron"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(46, 255, 122, 0.08), 0 0 12px rgba(245, 200, 66, 0.06)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        rise: 'rise 0.35s ease-out forwards',
        pop: 'pop 0.25s ease-out forwards',
        drift: 'drift 12s ease-in-out infinite',
        marquee: 'marquee 18s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(183, 142, 30, 0.2)' },
          '50%': {
            boxShadow:
              '0 0 22px rgba(183, 142, 30, 0.42), 0 0 38px rgba(15, 106, 72, 0.12)',
          },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '60%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, 8px, 0)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
