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
    },
  },
};
