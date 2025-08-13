/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Only scan viewer entry and pure preview components
    './src/viewer/**/*.{ts,tsx,html}',
    './src/components/PurePreview.tsx',
    './src/components/sections/**/*.{ts,tsx}',
    // Include lib files that are used by PurePreview
    './src/lib/toml.ts',
    './src/lib/googleFonts.ts',
  ],
  theme: {
    extend: {
      // Custom CSS variables for theme integration
      colors: {
        'primary-color': 'var(--primary-color)',
        'secondary-color': 'var(--secondary-color)',
      }
    },
  },
  // Safelist for dynamic classes that might be generated from TOML config
  safelist: [
    // Background colors that might be generated dynamically
    'bg-blue-500',
    'bg-blue-600', 
    'bg-indigo-500',
    'bg-indigo-600',
    'bg-purple-500',
    'bg-purple-600',
    'bg-pink-500',
    'bg-pink-600',
    'bg-red-500',
    'bg-red-600',
    'bg-orange-500',
    'bg-orange-600',
    'bg-yellow-500',
    'bg-yellow-600',
    'bg-green-500',
    'bg-green-600',
    'bg-teal-500',
    'bg-teal-600',
    'bg-cyan-500',
    'bg-cyan-600',
    // Text colors
    'text-white',
    'text-black',
    'text-gray-100',
    'text-gray-200',
    'text-gray-300',
    'text-gray-400',
    'text-gray-500',
    'text-gray-600',
    'text-gray-700',
    'text-gray-800',
    'text-gray-900',
    // Border colors
    'border-gray-200',
    'border-gray-300',
    'border-gray-400',
    'border-gray-500',
    // Hover states
    'hover:bg-blue-600',
    'hover:bg-indigo-600',
    'hover:bg-purple-600',
    'hover:bg-pink-600',
    'hover:bg-red-600',
    'hover:bg-orange-600',
    'hover:bg-yellow-600',
    'hover:bg-green-600',
    'hover:bg-teal-600',
    'hover:bg-cyan-600',
    'hover:opacity-90',
    'hover:opacity-80',
    // Common layout classes
    'min-h-screen',
    'bg-white',
    'text-center',
    'flex',
    'items-center',
    'justify-center',
    'p-6',
    'mb-2',
    'text-lg',
    'font-semibold',
    'text-sm',
    'text-destructive',
  ],
  plugins: [],
};