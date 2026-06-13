import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172026',
        mist: '#eef3f6',
        aqua: '#0f9f9a',
        coral: '#f25f4c',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      boxShadow: {
        panel: '0 18px 60px rgb(23 32 38 / 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
