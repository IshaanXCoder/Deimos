// theme.jsx - Instrument-only theme for Deimos
// Includes light + dark variants

const THEMES = {
  instrument: {
    name: 'Instrument',
    tagline: 'Technical · Data-forward · Terminal',
    light: {
      bg: '#f5f3ee',
      surface: '#ffffff',
      surface2: '#ecebe4',
      border: '#d9d6cb',
      borderStrong: '#19181a',
      text: '#19181a',
      textDim: '#6a6a6a',
      textMuted: '#8a8a8a',
      accent: '#e9492f',     // vermilion
      accent2: '#0f766e',    // teal
      success: '#0f766e',
      warn: '#b45309',
      chrome: '#19181a',
      onChrome: '#f5f3ee',
      chip: '#19181a',
      onChip: '#f5f3ee',
      grid: 'rgba(25,24,26,0.07)',
    },
    dark: {
      bg: '#0d0d0e',
      surface: '#171719',
      surface2: '#222226',
      border: '#2b2b30',
      borderStrong: '#f5f3ee',
      text: '#f5f3ee',
      textDim: '#a8a8a8',
      textMuted: '#6a6a6a',
      accent: '#ff6a4d',
      accent2: '#5eead4',
      success: '#5eead4',
      warn: '#fbbf24',
      chrome: '#f5f3ee',
      onChrome: '#0d0d0e',
      chip: '#f5f3ee',
      onChip: '#0d0d0e',
      grid: 'rgba(245,243,238,0.06)',
    },
    fontDisplay: '"JetBrains Mono", ui-monospace, monospace',
    fontBody: '"Inter Tight", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',
    radius: 4,
    radiusCard: 8,
  },
};

window.THEMES = THEMES;
