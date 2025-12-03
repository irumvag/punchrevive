import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Configure responsive breakpoints: mobile ≤768px, tablet 769-1024px, desktop >1024px
    screens: {
      'sm': '640px',
      'md': '769px',   // Tablet breakpoint
      'lg': '1025px',  // Desktop breakpoint
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'haunted-black': '#000000',
        'toxic-green': '#0f0',
        'dark-green': '#003300',
      },
      fontFamily: {
        'mono': ['var(--font-ibm-plex-mono)', 'monospace'],
        'creepster': ['var(--font-creepster)', 'cursive'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        shake: 'shake 0.5s ease-in-out',
      },
      // Minimum touch target sizes for mobile
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
};

export default config;
