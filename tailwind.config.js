/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'hover:shadow-[0_0_32px_8px_#27ae60]',
    'hover:shadow-lg',
    'shadow-md'
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          blue: '#3B4CCA',
          red: '#FF0000',
          yellow: '#FFDE00',
          types: {
            bug: '#92BC2C',
            dragon: '#0C69C8',
            fairy: '#EE90E6',
            fire: '#FBA54C',
            ghost: '#5F6DBC',
            ground: '#E0C068',
            normal: '#A8A878',
            psychic: '#F85888',
            steel: '#B8B8D0',
            dark: '#705848',
            electric: '#F8D030',
            fighting: '#C03028',
            flying: '#A890F0',
            grass: '#78C850',
            ice: '#98D8D8',
            poison: '#A040A0',
            rock: '#B8A038',
            water: '#6890F0'
          }
        },
        'type': {
          'normal': '#A8A878',
          'fire': '#F08030',
          'water': '#6890F0',
          'electric': '#F8D030',
          'grass': '#78C850',
          'ice': '#98D8D8',
          'fighting': '#C03028',
          'poison': '#A040A0',
          'ground': '#E0C068',
          'flying': '#A890F0',
          'psychic': '#F85888',
          'bug': '#A8B820',
          'rock': '#B8A038',
          'ghost': '#705898',
          'dragon': '#7038F8',
          'steel': '#B8B8D0',
          'fairy': '#EE99AC',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} 