import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4A93D',
        ember: '#FF6B1A',
        haze: '#C8C0B8',
        coal: '#0C0C0C',
        ink: '#141414',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Sora"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(212, 169, 61, 0.08), 0 4px 32px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        rise: 'rise 0.35s ease-out forwards',
        pop: 'pop 0.25s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(212, 169, 61, 0.25)' },
          '50%': { boxShadow: '0 0 22px rgba(212, 169, 61, 0.6), 0 0 44px rgba(212, 169, 61, 0.2)' },
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
      },
    },
  },
  plugins: [],
} satisfies Config
