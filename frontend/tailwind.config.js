export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        abyss: 'var(--ecomer-abyss)',
        navy: {
          DEFAULT: 'var(--ecomer-navy)',
          soft: 'var(--ecomer-navy-soft)'
        },
        ocean: {
          DEFAULT: 'var(--ecomer-ocean)',
          bright: 'var(--ecomer-ocean-bright)'
        },
        cyan: {
          ecomer: 'var(--ecomer-cyan)'
        },
        teal: {
          ecomer: 'var(--ecomer-teal)'
        },
        eco: {
          green: 'var(--ecomer-green)',
          amber: 'var(--ecomer-amber)',
          orange: 'var(--ecomer-orange)',
          red: 'var(--ecomer-red)'
        },
        surface: 'var(--ecomer-surface)',
        hairline: 'var(--ecomer-border)'
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12)',
        float: '0 12px 32px -8px rgba(4, 16, 28, 0.35)'
      }
    }
  }
}
