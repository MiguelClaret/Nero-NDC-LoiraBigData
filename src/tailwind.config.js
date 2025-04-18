/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
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
        boxShadow: {
          sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
          md: '0 4px 6px rgba(0, 0, 0, 0.1)',
          lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
          xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
        },
        borderRadius: {
          'sm': '4px',
          'md': '8px',
          'lg': '12px',
          'xl': '16px',
        },
        animation: {
          'fadeIn': 'fadeIn 0.3s ease-out',
          'fadeOut': 'fadeOut 0.3s ease-out',
          'pulse': 'pulse 1.5s infinite ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeOut: {
            '0%': { opacity: '1', transform: 'translateY(0)' },
            '100%': { opacity: '0', transform: 'translateY(10px)' },
          },
          pulse: {
            '0%, 100%': { transform: 'scale(0.8)', opacity: '0.5' },
            '50%': { transform: 'scale(1.2)', opacity: '1' },
          },
        },
      },
    },
    plugins: [],
  }