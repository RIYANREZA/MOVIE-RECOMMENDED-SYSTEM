/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          black: '#0B0B0B',
          dark: '#141414',
          gray: '#1c1c1c',
          lightGray: '#aaaaaa',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 15px rgba(229, 9, 20, 0.6)',
        'card-glow': '0 8px 30px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
