/**
 * Modern color scheme for Deimos benchmarking app
 */

const tintColorLight = '#6366f1'; // Modern indigo
const tintColorDark = '#a855f7'; // Modern purple

export const Colors = {
  light: {
    text: '#1f2937',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    tint: tintColorLight,
    icon: '#6b7280',
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    cardBorder: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    muted: '#f3f4f6',
    mutedForeground: '#6b7280',
  },
  dark: {
    text: '#f9fafb',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    tint: tintColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
    card: '#1e293b',
    cardBorder: '#334155',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#f87171',
    primary: '#8b5cf6',
    secondary: '#a855f7',
    accent: '#0ea5e9',
    muted: '#334155',
    mutedForeground: '#94a3b8',
  },
};

// Framework-specific colors
export const FrameworkColors = {
  circom: '#ff6b6b',
  halo2: '#4ecdc4', 
  noir: '#45b7d1',
};

// Algorithm-specific colors
export const AlgorithmColors = {
  sha256: '#ff9f43',
  keccak: '#6c5ce7',
  poseidon: '#fd79a8',
};
