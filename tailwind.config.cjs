/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effaf5",
          500: "#1b7f5a",
          700: "#11513a"
        },
        slate: {
          950: "#0f172a"
        }
      }
    }
  },
  plugins: []
};
