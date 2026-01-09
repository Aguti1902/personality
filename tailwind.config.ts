import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f1f9',
          100: '#c4d9ed',
          200: '#9cc1e1',
          300: '#74a9d5',
          400: '#4c91c9',
          500: '#224469', // Main brand color
          600: '#1b3654',
          700: '#14283f',
          800: '#0d1a2a',
          900: '#060c15',
        },
        secondary: {
          50: '#fff4e8',
          100: '#ffe0bd',
          200: '#ffcc92',
          300: '#ffb866',
          400: '#ffa43b',
          500: '#FF852A', // Secondary brand color (orange)
          600: '#cc6a22',
          700: '#994f19',
          800: '#663511',
          900: '#331a08',
        },
        // Mantener verde turquesa como accent para gráficos
        accent: {
          50: '#e6faf5',
          100: '#b3f0e0',
          200: '#80e6cb',
          300: '#4ddcb6',
          400: '#1ad2a1',
          500: '#07C59A',
          600: '#069e7b',
          700: '#04775c',
          800: '#03503d',
          900: '#01291e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

