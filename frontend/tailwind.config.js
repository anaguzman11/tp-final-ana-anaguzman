/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brandGreen: {
                    DEFAULT: '#A9C47F', // Lime Green
                    dark: '#8BA664',
                },
                brandTeal: {
                    DEFAULT: '#2C5F5D', // Dark Teal
                    light: '#3D7A78',
                },
                brandBlue: {
                    DEFAULT: '#89CFF0', // Sky Blue
                    light: '#BAE1F2',
                },
                brandCream: {
                    DEFAULT: '#F2ECE4', // Cream
                    dark: '#E5DED5',
                },
                // Maintaining primary/secondary for utility but mapping to brand colors
                primary: '#A9C47F',
                secondary: '#2C5F5D',
                neutral: '#F2ECE4',
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
