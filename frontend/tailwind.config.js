/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    50: '#fdf8ef',
                    100: '#faefd5',
                    200: '#f4dcaa',
                    300: '#edc474',
                    400: '#e5a73d',
                    500: '#e0a96d',
                    600: '#c97d2a',
                    700: '#a75f23',
                    800: '#874c23',
                    900: '#6e3f20',
                },
                charcoal: {
                    50: '#f5f5f7',
                    100: '#e5e5ea',
                    200: '#cdcdd4',
                    300: '#ababb5',
                    400: '#82828f',
                    500: '#676774',
                    600: '#585863',
                    700: '#4a4a53',
                    800: '#1a1a2e',
                    900: '#12121f',
                    950: '#0a0a14',
                },
                cream: {
                    50: '#fefcf7',
                    100: '#fdf7eb',
                    200: '#faefd5',
                    300: '#f5e0b0',
                    400: '#f0d08a',
                },
            },
            fontFamily: {
                display: ['"Playfair Display"', 'Georgia', 'serif'],
                body: ['"Inter"', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
