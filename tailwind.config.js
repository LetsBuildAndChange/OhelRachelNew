/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    colors: {
      primary: "#ffd700",
      secondary: "#00bfff",
      third: "#000000",
      fourth: "#ffffff",
      light: {
        100: "#D6C6FF",
        200: "#A8B5DB",
        300: "#9CA4AB",
      },
      dark: {
        100: "#221f3d",
        200: "#0f0d23",
      },

      accent: "#AB8BFF"
    }
  },
  plugins: [],
}

