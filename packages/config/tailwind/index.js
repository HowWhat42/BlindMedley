/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#EAD4FF",
        dark: "#171717",
        grey: "#2B2B2B",
        purple: "#7D00FA",
        "purple-light": "#BD7AFF",
        blue: "#0094FF",
      },
    },
  },
  plugins: [],
};
