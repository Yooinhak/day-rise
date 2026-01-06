/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "bg-warm": "#FBF6F0",
        card: "#FFFCF8",
        primary: "#E08162",
        secondary: "#7F9B8F",
        "text-main": "#3C322B",
        "text-sub": "#7C736C",
        "border-soft": "#F0E6DD",
        muted: "#F6EFE8",
        accent: "#F3D7C9",
      },
    },
  },
  plugins: [],
};
