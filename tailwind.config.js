/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "bg-warm": "#FDFCF8",
        primary: "#E9967A",
        secondary: "#8DA399",
        "text-main": "#4A3F35",
        "text-sub": "#948B83",
        card: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
