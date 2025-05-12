

/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      vexIq: "#0074BD",
      vexV5: "#D8262F",
      vexGo: "#007378",
      vex123: "#6D4284",
      gold: {
        300: '#D4AF37',
        500: '#B8860B',
      }
    },
    animation: {
      marquee: "marquee 60s linear infinite",
      marqueePaused: "marquee 60s linear infinite paused",
      float: "float 3s ease-in-out infinite",
      fadeIn: "fadeIn 0.6s ease-in forwards",
      fadeInUp: "fadeInUp 0.8s ease-out forwards",
      overlayFade: "overlayFade 1.2s ease-in forwards",
      progressBar: "progressBar 1.5s ease-in-out forwards",
      revealFade: "revealFade 3s ease-in-out forwards",
      progress: "progress 2s ease-in-out forwards",
      fadeInDown: 'fadeInDown 0.5s ease-out',
    },
    keyframes: {
       fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      fadeInUp: {
        "0%": { opacity: "0", transform: "translateY(20px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      overlayFade: {
        "0%": { opacity: "0" },
        "100%": { opacity: "0.75" },
      },
      progressBar: {
        "0%": { width: "0%", opacity: "0" },
        "100%": { width: "75%", opacity: "1" },
      },
      progress: {
        "0%": { transform: "scaleX(0)" },
        "100%": { transform: "scaleX(1)" }
      },
      revealFade: {
        "0%": { clipPath: "inset(0 0 100% 0)", opacity: "0" },
        "25%": { clipPath: "inset(0 0 75% 0)", opacity: "0.25" },
        "50%": { clipPath: "inset(0 0 50% 0)", opacity: "0.5" },
        "75%": { clipPath: "inset(0 0 25% 0)", opacity: "0.75" },
        "100%": { clipPath: "inset(0 0 0 0)", opacity: "1" },
      },
        marquee: {
          from: { transform: "translateX(0)" }, // يبدأ من موضعه الطبيعي، وليس خارج الشاشة
          to: { transform: "translateX(-100%)" }, // يتحرك حتى يخرج من اليسار بالكامل
        },

      float: {
        "0%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-10px)" },
        "100%": { transform: "translateY(0)" },
      },
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    },
  },
};
export const plugins = [];
