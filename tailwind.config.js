/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        drip: {
          primary: "#2E9BD6",
          "primary-content": "#0A2540",
          secondary: "#5DCAA5",
          "secondary-content": "#04342C",
          accent: "#85B7EB",
          "accent-content": "#042C53",
          neutral: "#0E2E4F",
          "neutral-content": "#E6F1FB",
          "base-100": "#0E2E4F",
          "base-200": "#0A2540",
          "base-300": "#143A5C",
          "base-content": "#E6F1FB",
          info: "#85B7EB",
          success: "#5DCAA5",
          warning: "#EF9F27",
          error: "#E24B4A",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.6rem",
        },
      },
    ],
  },
};
