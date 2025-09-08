import React from 'react';

export interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, onToggle }) => (
  <button
    className="theme-toggle"
    type="button"
    onClick={onToggle}
    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    aria-pressed={darkMode}
  >
    {darkMode ? 'Dark Mode' : 'Light Mode'}
  </button>
);