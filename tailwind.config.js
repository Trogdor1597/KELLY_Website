/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs', // Watch all .ejs files in the views directory and subdirectories
    './public/js/**/*.js', // Watch all .js files for dynamic classes
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'), // Add the aspect-ratio plugin
  ],
}