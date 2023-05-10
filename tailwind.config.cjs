module.exports = {
  mode: 'jit',
  darkMode: 'media',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter var', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: {
          50: '#edf9ff',
          100: '#d6efff',
          200: '#b6e5ff',
          300: '#85d6ff',
          400: '#4bbeff',
          500: '#229dff',
          600: '#0a7eff',
          700: '#0466f1',
          800: '#0a4fbd',
          900: '#0f4899',
          950: '#0f2d5c',
        },
      },
    },
  },
};
