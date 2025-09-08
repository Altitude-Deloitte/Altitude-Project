/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,css}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkbg: "#09040E",
        darktext: "#FFFFFF",
        darksecondary: "#8D4BFF",
        lightbg: "#FAFAFA",
        lighttext: "#121212",
        darkButton: "#8D4BFF",
      },
    },
  },
  plugins: [],
};
