/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: {
          DEFAULT: '#f8fafc', // Slate 50
          muted: '#f1f5f9',   // Slate 100
          active: '#e2e8f0',  // Slate 200
        },
        border: {
          DEFAULT: '#e2e8f0', // Slate 200
          strong: '#cbd5e1',  // Slate 300
        },
        primary: {
          DEFAULT: '#2563eb', // Blue 600
          hover: '#1d4ed8',   // Blue 700
          subtle: '#eff6ff',  // Blue 50
          border: '#bfdbfe',  // Blue 200
        },
        text: {
          main: '#0f172a',    // Slate 900
          muted: '#64748b',   // Slate 500
          light: '#94a3b8',   // Slate 400
        },
        status: {
          success: '#16a34a',       // Green 600
          successBg: '#f0fdf4',     // Green 50
          successBorder: '#bbf7d0', // Green 200
          
          warning: '#d97706',       // Amber 600
          warningBg: '#fffbeb',     // Amber 50
          warningBorder: '#fde68a', // Amber 200
          
          danger: '#dc2626',        // Red 600
          dangerBg: '#fef2f2',      // Red 50
          dangerBorder: '#fecaca',  // Red 200

          info: '#0284c7',          // Sky 600
          infoBg: '#f0f9ff',        // Sky 50
          infoBorder: '#bae6fd',    // Sky 200
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'none': 'none',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
