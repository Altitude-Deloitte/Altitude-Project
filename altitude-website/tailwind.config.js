/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        custom: {
          "bg-light": "#ffffff",
          "bg-dark": "#040105",
          primary: "#A247FC",
          secondary: "#C63BEE",
          "text-light": "#1f2937",
          "text-dark": "#f8fafc",
        },
        purple: {
          "gradient-start": "#A247FC",
          "gradient-end": "#C63BEE",
        },
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(135deg, #A247FC 0%, #C63BEE 100%)",
        "custom-gradient-hover":
          "linear-gradient(135deg, #9333ea 0%, #b91c7c 100%)",
      },
    },
  },
  plugins: [],
};
