/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calm learning palette - warm off-white backgrounds
        background: {
          primary: '#fdfdfc',
          secondary: '#faf9f6',
        },
        // Near-black text with warmth for high contrast
        text: {
          primary: '#1a1816',
          secondary: '#2d2a27',
          muted: '#57534e',
        },
        // Legacy text colors for compatibility
        textPrimary: '#1a1816',
        textSecondary: '#2d2a27',
        // Single accent color - warm orange for trust & energy
        accent: {
          primary: '#ED7D3A',
          hover: '#d66d2f',
        },
        // Message and UI surfaces
        primary: '#4D9078',        // Tutor message background (sage green)
        surface: '#f5f3f0',        // Card/container background (warm light)
        surfaceRaised: '#ebe8e3',  // Elevated elements (slightly darker)
        // Custom palette - muted, harmonious colors for mode cards
        card: {
          sage: '#4D9078',      // Algorithms - calm, growth-oriented
          beige: '#D8BCAB',     // Learning - comfortable, approachable
          blueGray: '#9899A6',  // Concepts - thoughtful, stable
          grayGreen: '#7E8987', // Technical - neutral, grounded
        },
        // Semantic colors
        success: '#059669',
        warning: '#f59e0b',
        error: '#dc2626',
        border: {
          light: '#DAD6D6',
          medium: '#d6d3d1',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.6' }],
        sm: ['0.875rem', { lineHeight: '1.7' }],
        base: ['1.0625rem', { lineHeight: '1.7' }], // 17px for comfortable reading
        lg: ['1.125rem', { lineHeight: '1.7' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
        '4xl': ['2.25rem', { lineHeight: '1.3' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-circ': 'cubic-bezier(0.85, 0, 0.15, 1)',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
      maxWidth: {
        'reading': '1400px',
      },
    },
  },
  plugins: [],
}
