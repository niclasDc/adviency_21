/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
        './node_modules/tw-elements/dist/js/**/*.js'
    ],
    theme: {
        colors: {
            'autumn-gold': '#cd722d',
            'golden-brown': '#dea369',
            'very-light-gray': '#c8cdc6',
            'fern': '#969a7e',
            'fern-green': '#445036',
            'pewter-gray': '#2c2c2a',
            'white': '#FFFFFF'
        },
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('flowbite/plugin'),
        require('tw-elements/dist/plugin')
    ],
}