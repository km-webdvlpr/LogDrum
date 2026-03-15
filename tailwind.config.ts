import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#090909',
        coal: '#10100f',
        gold: '#d4a93d',
        ember: '#ff6b1a',
        spice: '#ff9345',
        moss: '#8f9f52',
        plum: '#542344',
        haze: '#f5e6b8'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 80px rgba(255, 107, 26, 0.18)',
        gold: '0 25px 80px rgba(212, 169, 61, 0.16)'
      },
      backgroundImage: {
        mural:
          'radial-gradient(circle at top left, rgba(255,107,26,0.35), transparent 38%), radial-gradient(circle at 80% 20%, rgba(212,169,61,0.28), transparent 32%), radial-gradient(circle at bottom right, rgba(84,35,68,0.38), transparent 36%), linear-gradient(135deg, #050505 0%, #11110f 45%, #1c120d 100%)'
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Sora"', 'sans-serif']
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        rise: 'rise 0.7s ease-out forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' }
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
