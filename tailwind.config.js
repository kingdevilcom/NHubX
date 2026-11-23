/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nhubx-bg-primary': 'rgb(var(--fire-background) / <alpha-value>)',
        'nhubx-bg-secondary': 'rgb(var(--fire-surface) / <alpha-value>)',
        'nhubx-glow-primary': 'rgb(var(--fire-accent) / <alpha-value>)',
        'nhubx-glow-secondary': 'rgb(var(--fire-highlight) / <alpha-value>)',
        'nhubx-accent': '#1f1f1f',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 1s infinite linear alternate-reverse',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgb(var(--fire-accent) / .18)',
        'glow-lg': '0 0 40px rgb(var(--fire-accent) / .25)',
      }
    },
  },
  plugins: [],
}
