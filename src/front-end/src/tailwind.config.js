/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        green: {
          50: '#f0f9f1',
          100: '#dcf1de',
          200: '#bbe3bf',
          300: '#92ce99',
          400: '#67b56f',
          500: '#4caf50',
          600: '#2e7d32',  // primary
          700: '#1b5e20',  // primary-dark
          800: '#174d1b',
          900: '#133d16',
        },
        amber: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',  // warning
          600: '#ffb300',  // secondary
          700: '#ff8f00',  // secondary-dark
          800: '#ff6f00',
          900: '#ff5722',
        },
      },
      // Resto das configurações...
    },
  },
  plugins: [],
}