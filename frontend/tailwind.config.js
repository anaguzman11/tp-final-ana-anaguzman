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
                // Nuevos colores de tu paleta
                bluby: '#4F79FF',
                mary: '#FFAA3B',
                hope: '#FF8A02',
                bone: '#FFF5F4',

                // Mapeo de primarios/secundarios para que el resto de la app se actualice
                primary: '#4F79FF',   // Bluby como primario
                secondary: '#FF8A02', // Hope como secundario
                neutral: '#FFF5F4',   // Bone como fondo/neutral
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
