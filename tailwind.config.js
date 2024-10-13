/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/front/**/*.{js,jsx,ts,tsx}", // Esto cubre todos los archivos JS/JSX en la carpeta front
    "./src/front/styles/**/*.css", // Asegúrate de incluir tus archivos CSS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
