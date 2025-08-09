/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        github: {
          900: '#0d1117'
        },
        border: '#e5e7eb', // Define your border color
        background: '#ffffff', // Define your background color
        foreground: '#000000', // Define your foreground color
      },
    },
  },
  plugins: [],
}