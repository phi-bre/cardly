module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Inter var', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        malibu: {
          DEFAULT: '#5DADFF',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#D7EBFF',
          300: '#AFD6FF',
          400: '#86C2FF',
          500: '#5DADFF',
          600: '#2591FF',
          700: '#0074EC',
          800: '#0059B4',
          900: '#003D7C',
        },
        shark: {
          DEFAULT: '#242628',
          50: '#7B8288',
          100: '#71787E',
          200: '#5E6368',
          300: '#4B4F53',
          400: '#373A3D',
          500: '#242628',
          600: '#090A0A',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
      },
    },
  },
};
