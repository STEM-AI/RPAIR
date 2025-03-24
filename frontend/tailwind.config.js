/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      vexIq: "#0074BD",
      vexV5: "#D8262F",
      vexGo: "#007378",
      vex123: "#6D4284",
    },
    animation: {
      marquee: "marquee 30s linear infinite",
    },
    keyframes: {
      marquee: {
        from: { transform: "translateX(100%)" },
        to: { transform: "translateX(-100%)" },
      },
    },
  },
};
export const plugins = [];
