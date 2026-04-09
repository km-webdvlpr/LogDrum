import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#B78E1E',
        ember: '#0F6A48',
        haze: '#667067',
        coal: '#E8DFC6',
        ink: '#16241C',
        paper: '#F8F2E3',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 14px 34px rgba(22, 36, 28, 0.09), 0 2px 12px rgba(183, 142, 30, 0.09)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        rise: 'rise 0.35s ease-out forwards',
        pop: 'pop 0.25s ease-out forwards',
        drift: 'drift 12s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
} satisfies Config
