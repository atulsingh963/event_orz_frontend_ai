/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eventorz: {
          navy:     '#0D0B2A',
          panel:    '#1A1547',
          violet:   '#4C1D95',
          purple:   '#8B5CF6',
          lavender: '#A78BFA',
          white:    '#FFFFFF',
          muted:    '#D4D4D6',
          slate:    '#5A6378',
          blue:     '#168BBA',
          green:    '#6BB76D',
          rose:     '#E66C7D',
          amber:    '#E88651',
          gold:     '#FFC700',
          red:      '#C64847',
        }
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)',
      }
    },
  },
  plugins: [],
}
