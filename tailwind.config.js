/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        mono: ['Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  safelist: [
    'bg-blue-50',
    'bg-green-50',
    'bg-purple-50',
    'bg-amber-50',
    'bg-gray-50',
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-amber-600',
    'text-gray-600',
    'border-blue-200',
    'border-green-200',
    'border-purple-200',
    'border-amber-200',
    'border-gray-200',
  ],
}