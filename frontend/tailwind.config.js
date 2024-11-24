module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00ffff',
        'neon-green': '#00ff00',
        'neon-red': '#ff0000',
        'neon-yellow': '#ffff00',
        'neon-orange': '#ff6600',
        'neon-purple': '#9900ff',
        'neon-pink': '#ff00ff', // Included neon-pink once
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
