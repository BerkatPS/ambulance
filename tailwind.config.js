const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                heading: ['Montserrat', 'Inter', ...defaultTheme.fontFamily.sans],
                body: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['Poppins', ...defaultTheme.fontFamily.sans],
                mono: ['Roboto Mono', ...defaultTheme.fontFamily.mono],
                medical: ['Nunito', ...defaultTheme.fontFamily.sans],
            },

            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1.16' }],
                '6xl': ['3.75rem', { lineHeight: '1.1' }],
                'medical-sm': ['0.875rem', { lineHeight: '1.4' }],
                'medical-base': ['1rem', { lineHeight: '1.5' }],
                'medical-lg': ['1.125rem', { lineHeight: '1.6' }],
            },

            fontWeight: {
                hairline: '100',
                thin: '200',
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '800',
                black: '900',
            },

            letterSpacing: {
                tightest: '-.075em',
                tighter: '-.05em',
                tight: '-.025em',
                normal: '0',
                wide: '.025em',
                wider: '.05em',
                widest: '.1em',
                'medical-heading': '-.01em',
            },

            colors: {
                primary: {
                    DEFAULT: '#FF624E',
                    50: '#FFF5F3',
                    100: '#FEEAE6',
                    200: '#FCD5CD',
                    300: '#FAB1A1',
                    400: '#F79078',
                    500: '#F46B55',
                    600: '#F04B31',
                    700: '#E1310F',
                    800: '#B6280C',
                    900: '#8A1E09',
                },

                secondary: {
                    DEFAULT: '#4B9CE3',
                    50: '#EAF3FC',
                    100: '#D5E7F9',
                    200: '#ACCFF3',
                    300: '#82B7EC',
                    400: '#599FE6',
                    500: '#4B9CE3',
                    600: '#2183DA',
                    700: '#1B6BB1',
                    800: '#155288',
                    900: '#0F3A5F',
                },

                accent: {
                    DEFAULT: '#FF9E5E',
                    50: '#FFF6EF',
                    100: '#FFECDE',
                    200: '#FFD4BB',
                    300: '#FFBD99',
                    400: '#FFB076',
                    500: '#FF9E5E',
                    600: '#FF853B',
                    700: '#FF6C18',
                    800: '#F55400',
                    900: '#C24400',
                },

                success: '#56C288',
                warning: '#FFB76B',
                danger: '#F15B50',
                info: '#4B9CE3',

                background: '#F8FAFD',
                foreground: '#2C3E50',

                medical: {
                    blue: '#4B9CE3',
                    coral: '#F46B55',
                    green: '#56C288',
                    orange: '#FF9E5E',
                    yellow: '#FFD15C',
                    purple: '#925CB1',
                    gray: {
                        50: '#F8FAFD',
                        100: '#F1F5FA',
                        200: '#E4ECF7',
                        300: '#D2DFF0',
                        400: '#A3B8D9',
                        500: '#7C94B6',
                        600: '#5E738F',
                        700: '#465C73',
                        800: '#354656',
                        900: '#20303E',
                    },
                },

                muted: {
                    DEFAULT: '#94A3B8',
                    foreground: '#64748B',
                },
            },

            borderRadius: {
                DEFAULT: '0.5rem',
                'sm': '0.375rem',
                'md': '0.5rem',
                'lg': '0.75rem',
                'xl': '1rem',
                '2xl': '1.5rem',
                'pill': '9999px',
                'circle': '50%',
            },

            boxShadow: {
                'inner-sm': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'button': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
                'card': '0 4px 12px -2px rgba(0, 0, 0, 0.06)',
                'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
                'medical': '0 6px 16px rgba(0, 0, 0, 0.05)',
                'hover': '0 12px 20px rgba(0, 0, 0, 0.07)',
            },

            animation: {
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
            },

            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },

            spacing: {
                '18': '4.5rem',
                '72': '18rem',
                '84': '21rem',
                '96': '24rem',
            },

            height: {
                'screen-90': '90vh',
            },

            maxWidth: {
                '8xl': '90rem',
                '9xl': '100rem',
            },

            zIndex: {
                '60': '60',
                '70': '70',
            },
        },
    },

    plugins: [
        require('@tailwindcss/forms'),
        // require('@tailwindcss/typography'),
        // require('@tailwindcss/aspect-ratio'),
    ],
};
