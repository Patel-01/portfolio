import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#0A0A0F',
          2: '#0F0F17',
          3: '#15151E',
          4: '#1C1C28',
        },
        violet: {
          DEFAULT: '#6E55FF',
          label: '#8B7BFF',
          dim: 'rgba(110,85,255,0.15)',
          border: 'rgba(110,85,255,0.3)',
        },
        mint: {
          DEFAULT: '#42F5C8',
          dim: 'rgba(66,245,200,0.12)',
          border: 'rgba(66,245,200,0.28)',
        },
        fg: {
          DEFAULT: '#E8E7FF',
          muted: '#A1A1B5',
          subtle: '#6B6B8A',
        },
        border: 'rgba(255,255,255,0.08)',
        glass: 'rgba(255,255,255,0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
