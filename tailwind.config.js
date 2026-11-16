/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: { extend: {
    colors: {
      canvas: 'rgb(var(--canvas) / <alpha-value>)',
      surface: 'rgb(var(--surface) / <alpha-value>)',
      ink: 'rgb(var(--ink) / <alpha-value>)',
      muted: 'rgb(var(--muted) / <alpha-value>)',
      line: 'rgb(var(--line) / <alpha-value>)',
      brand: 'rgb(var(--brand) / <alpha-value>)',
      'on-brand': 'rgb(var(--on-brand) / <alpha-value>)',
    },
    fontFamily: { display: ['Georgia', 'serif'] },
  } },
  plugins: [],
};
