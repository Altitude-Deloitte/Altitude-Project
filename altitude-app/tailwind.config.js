/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkbg: "#09040E",
        darktext: "#FFFFFF",
        darkbutton: "#8D4BFF",
        darksecondary: "#8D4BFF",
        lightbg: "#FAFAFA",
        lighttext: "#121212",
      },
    },
  },
  plugins: [],
};
