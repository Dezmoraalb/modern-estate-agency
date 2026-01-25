/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {
        colors: {
          'dark-bg': '#000000',
          'dark-card': '#0a0a0a',
        },
        fontFamily: {
          display: ['Playfair Display', 'serif'],
          body: ['Manrope', 'sans-serif'],
        },
        backgroundImage: {
          // Більш металевий та різкий градієнт
          'gold-gradient': 'linear-gradient(135deg, #a67c00 0%, #bf953f 25%, #fcf6ba 50%, #bf953f 75%, #a67c00 100%)',
          'gold-text': 'linear-gradient(to right, #bf953f, #fcf6ba, #bf953f)',
        },
        animation: {
          'float': 'float 8s ease-in-out infinite',
          'scroll': 'scroll 20s linear infinite',
          'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'reveal': 'reveal 1s ease-out forwards',
          'gradient-border': 'gradient-border 3s linear infinite',
          'shimmer': 'shimmer 2s linear infinite',
          'shimmer-text': 'shimmer-text 8s linear infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          scroll: {
            '0%': { transform: 'translateY(0)' },
            '100%': { transform: 'translateY(-50%)' },
          },
          reveal: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          'gradient-border': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
          'shimmer-text': {
            '0%': { backgroundPosition: '100% 0' },
            '100%': { backgroundPosition: '-100% 0' },
          },
        }
      },
    },
    plugins: [],
  }