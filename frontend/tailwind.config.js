/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode : "class",
  theme: {
    extend: {
      colors: {
        vexIq:"#0074BD",
        vexV5:"#D8262F",
        vexGo:"#007378",
       
      }, 
    },
  },
  plugins: [],
}