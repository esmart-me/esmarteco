/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bbdcff',
          300: '#8cc5ff',
          400: '#55a4ff',
          500: '#2b7fff',
          600: '#135bec',
          700: '#0f52ba', // Signature E Smart Blue
          800: '#113ca8',
          900: '#143684',
          950: '#102251',
        },
        uae: {
          red: '#CE1126',
          green: '#007A3D',
          gold: '#C59B27',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 24px -6px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
