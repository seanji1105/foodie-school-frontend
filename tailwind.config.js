/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#3B82F6", // Blue-500
        "primary-dark": "#2563EB", // Blue-600
        secondary: "#F472B6", // Pink-400
        light: "#F9FAFB", // Gray-50
        medium: "#6B7280", // Gray-500
      },
    },
  },
  plugins: [],
};
