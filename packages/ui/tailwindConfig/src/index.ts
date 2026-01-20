import type { Config } from "tailwindcss";

/**
 * Base Tailwind configuration shared across all piar applications
 * Apps can extend this configuration with their own customizations
 */
export const baseConfig: Partial<Config> = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          orange: "#ec6b38",
          blue: "#262b50",
          white: "#ffffff",
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: '2.25rem',
              fontWeight: '700',
              color: 'var(--foreground)',
              lineHeight: '1.2',
            },
            h2: {
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: '1.875rem',
              fontWeight: '700',
              color: 'var(--foreground)',
              lineHeight: '1.3',
            },
            h3: {
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--foreground)',
              lineHeight: '1.4',
            },
            p: {
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: '1rem',
              lineHeight: '1.6',
              color: 'var(--foreground)',
            },
            a: {
              fontWeight: '600',
              color: 'var(--foreground)',
              '&:hover': {
                color: '#ec6b38',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default baseConfig;
