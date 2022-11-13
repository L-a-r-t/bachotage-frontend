/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "rgb(17 94 87)",
        green: {
          main: "#7d7",
        },
        red: {
          main: "#e33",
        },
        blue: {
          main: "#33a",
        },
      },
      width: {
        clamp: "clamp(50%, 650px, 95%)",
        "clamp-64": "clamp(40%, 16rem, 95%)",
        "clamp-72": "clamp(40%, 18rem, 95%)",
        "clamp-xl": "clamp(70%, 18rem, 95%)",
      },
      minWidth: {
        36: "9rem",
        28: "7rem",
      },
      maxWidth: {
        "1/2": "50%",
        "1/3": "33.3333%",
        "1/4": "25%",
      },
      height: {
        "fit-screen": "calc(100vh - 3rem)",
      },
      minHeight: {
        "fit-screen": "calc(100vh - 3rem)",
        "1/2": "50%",
        48: "12rem",
        36: "9rem",
        28: "7rem",
      },
      maxHeight: {
        "screen-80": "80vh",
      },
      aspectRatio: {
        "2/1": "2/1",
      },
      keyframes: {
        "rise-6": {
          "0%": { transform: "translate(0, 6rem)", opacity: "0%" },
          "10%, 90%": { opacity: "100%" },
          "100%": { transform: "translate(0, -6rem)", opacity: "0%" },
        },
        "rise-10": {
          "0%": { transform: "translate(0, 10rem)", opacity: "0%" },
          "10%, 90%": { opacity: "100%" },
          "100%": { transform: "translate(0, -10rem)", opacity: "0%" },
        },
        "rise-14": {
          "0%": { transform: "translate(0, 14rem)", opacity: "0%" },
          "10%, 90%": { opacity: "100%" },
          "100%": { transform: "translate(0, -14rem)", opacity: "0%" },
        },
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
}
