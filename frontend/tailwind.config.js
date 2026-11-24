/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SkillSetu Brand Palette
        ivory: {
          50: '#FDFCF9',
          100: '#FAF8F3',
          DEFAULT: '#F6F3EB', // Warm Ivory
          200: '#EFE9DC',
          300: '#E5DCB8',
          dark: '#E0D6C3',
        },
        teal: {
          50: '#E8F0F1',
          100: '#C7DCE0',
          500: '#265D65',
          DEFAULT: '#183E43', // Deep Teal
          600: '#143539',
          700: '#0F272B',
          800: '#0B1E21',
          900: '#0A1B1E',
          950: '#071315',
        },
        terracotta: {
          50: '#FBF5F3',
          100: '#F5E4DE',
          200: '#EACAC0',
          300: '#DFA697',
          500: '#C77056',
          DEFAULT: '#B45D43', // Terracotta
          600: '#A04E36',
          700: '#8A3F2A',
          800: '#6C2F1E',
          900: '#532214',
        },
        beige: {
          50: '#FAF8F5',
          100: '#F3EFE8',
          DEFAULT: '#D9CDBB', // Sand Beige
          200: '#CDBFA9',
          300: '#BDAE95',
          dark: '#AB9B81',
        },
        greygreen: {
          50: '#F2F4F3',
          100: '#DFE4E2',
          DEFAULT: '#52615C', // Muted Grey-Green
          600: '#43504C',
          700: '#343E3B',
          800: '#242C2A',
        },
        // Dark Mode Tailored Palette
        charcoal: {
          DEFAULT: '#0E1D20',
          50: '#24454B',
          100: '#1F3C41',
          700: '#1A3337',
          800: '#14292D',
          900: '#0E1D20', // Main dark canvas
          950: '#091416', // Darker surface
        }
      },
      fontFamily: {
        heading: ['"DM Sans"', 'sans-serif'],
        body: ['Inter', '"Noto Sans"', '"Noto Sans Devanagari"', '"Noto Sans Bengali"', '"Noto Sans Telugu"', '"Noto Sans Tamil"', '"Noto Sans Kannada"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
