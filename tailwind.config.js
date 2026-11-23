/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nhubx-bg-primary': '#0a0a0a',
        'nhubx-bg-secondary': '#121212',
        'nhubx-glow-primary': '#ff3c00',
        'nhubx-glow-secondary': '#ff7a00',
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
        'glow': '0 0 20px rgba(255, 60, 0, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 60, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
