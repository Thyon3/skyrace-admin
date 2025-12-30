/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00A991',
                    dark: '#00796B',
                    light: '#B2DFDB',
                },
                secondary: '#263238',
                accent: '#FFC107',
                background: '#F8FAFB',
                surface: '#FFFFFF',
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
                'medium': '0 8px 30px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
}
