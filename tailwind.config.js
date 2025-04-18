/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          green: {
            50: '#f0f9f0',
            100: '#dcefdc',
            200: '#bfe0bf',
            300: '#94ce94',
            400: '#68b668',
            500: '#4CAF50',
            600: '#2E7D32',
            700: '#1B5E20',
            800: '#0A3A0A',
            900: '#052605',
          },
          amber: {
            400: '#FFCA28',
            500: '#FF8F00',
            600: '#F57C00',
          }
        },
        scale: {
          '102': '1.02',
        },
        animation: {
          'fadeIn': 'fadeIn 0.8s ease-out forwards',
          'slideIn': 'slideIn 0.5s ease-out forwards',
          'pulse': 'pulse 2s infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          slideIn: {
            '0%': { transform: 'translateX(-50px)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          pulse: {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' },
          },
        },
      },
    },
    plugins: [],
  }