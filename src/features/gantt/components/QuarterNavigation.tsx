/**
 * QuarterNavigation Component
 * 
 * A dedicated navigation component for moving between quarters in the Gantt chart view.
 * This component will be extracted from the GanttChart to provide reusable quarter 
 * navigation functionality across the application.
 * 
 * Intended Features:
 * - Previous/Next quarter navigation buttons with arrow indicators
 * - Current quarter display (e.g., "Q3 2025") with proper formatting
 * - Automatic year transitions when navigating between Q4->Q1 and Q1->Q4
 * - Keyboard navigation support (arrow keys, Enter/Space for buttons)
 * - Optional quick quarter selection dropdown or picker
 * - "Today" button to jump to current quarter
 * 
 * Props Interface (planned):
 * - currentYear: number - The currently selected year
 * - currentQuarter: 1 | 2 | 3 | 4 - The currently selected quarter
 * - onQuarterChange: (year: number, quarter: number) => void - Callback for navigation
 * - showQuickSelect?: boolean - Whether to show quarter/year picker
 * - showTodayButton?: boolean - Whether to show "jump to today" button
 * - disabled?: boolean - Whether navigation is disabled
 * - className?: string - Additional CSS classes
 * 
 * Integration Points:
 * - Will use existing date utilities from utils/dateUtils.ts
 * - Will follow Estonian localization patterns from the project
 * - Can be used in GanttChart, standalone views, or other timeline components
 * - Will integrate with the existing Quarter type from types/index.ts
 * 
 * Styling Approach:
 * - Consistent with existing button components in ui/Button.tsx
 * - Responsive design for mobile and desktop
 * - Clear visual hierarchy for current quarter vs navigation controls
 * - Accessible focus states and ARIA labels for screen readers
 * 
 * Future Enhancements:
 * - Breadcrumb-style navigation showing year context
 * - Preset ranges (e.g., "This Year", "Next Year")
 * - Validation to prevent navigation to invalid date ranges
 * - Integration with URL routing for bookmarkable quarter views
 */

import React, { useCallback } from 'react';
import '../gantt.css';
import { useQuarterNavigation } from '../hooks/useQuarterNavigation';

interface QuarterNavigationProps {
  currentYear: number;
  currentQuarter: 1 | 2 | 3 | 4;
  onQuarterChange: (year: number, quarter: 1 | 2 | 3 | 4) => void;
  viewMode: 'quarter' | 'year';
  onViewModeChange?: (mode: 'quarter' | 'year') => void;
  showTodayButton?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Lightweight quarter navigation component with previous/next controls and
 * optional "Today" button. Uses the useQuarterNavigation hook for state management.
 * Keyboard navigation is supported via left and right arrow keys when focused.
 */
export const QuarterNavigation: React.FC<QuarterNavigationProps> = ({
  currentYear,
  currentQuarter,
  onQuarterChange,
  viewMode,
  onViewModeChange,
  showTodayButton = false,
  disabled = false,
  className = ''
}) => {
  // Use the hook for quarter navigation logic with the external callback
  const {
    goToPrevious,
    goToNext,
    goToToday,
    canGoBack,
    canGoForward
  } = useQuarterNavigation(currentYear, currentQuarter, {
    onNavigate: onQuarterChange
  });

  const handlePrevious = useCallback(() => {
    if (disabled) return;
    if (viewMode === 'quarter') {
      if (!canGoBack) return;
      goToPrevious();
    } else {
      onQuarterChange(currentYear - 1, currentQuarter);
    }
  }, [disabled, viewMode, canGoBack, goToPrevious, onQuarterChange, currentYear, currentQuarter]);

  const handleNext = useCallback(() => {
    if (disabled) return;
    if (viewMode === 'quarter') {
      if (!canGoForward) return;
      goToNext();
    } else {
      onQuarterChange(currentYear + 1, currentQuarter);
    }
  }, [disabled, viewMode, canGoForward, goToNext, onQuarterChange, currentYear, currentQuarter]);

  const handleToday = useCallback(() => {
    if (disabled) return;
    if (viewMode === 'quarter') {
      goToToday();
    } else {
      const now = new Date();
      const q = (Math.floor(now.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
      onQuarterChange(now.getFullYear(), q);
    }
  }, [disabled, viewMode, goToToday, onQuarterChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    },
    [handlePrevious, handleNext]
  );

  return (
    <div
      className={`quarter-navigation ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="nav-button nav-prev"
        onClick={handlePrevious}
        disabled={disabled || (viewMode === 'quarter' && !canGoBack)}
        aria-label={viewMode === 'quarter' ? 'Previous quarter' : 'Previous year'}
      >
        &#8249;
      </button>

      <div className="quarter-label">
        <h2>
          {viewMode === 'quarter'
            ? `Q${currentQuarter} ${currentYear}`
            : `${currentYear}`}
        </h2>
      </div>

      <button
        type="button"
        className="nav-button nav-next"
        onClick={handleNext}
        disabled={disabled || (viewMode === 'quarter' && !canGoForward)}
        aria-label={viewMode === 'quarter' ? 'Next quarter' : 'Next year'}
      >
        &#8250;
      </button>

      <button
        type="button"
        className="nav-button nav-toggle"
        onClick={() => onViewModeChange?.(viewMode === 'quarter' ? 'year' : 'quarter')}
        disabled={disabled}
      >
        {viewMode === 'quarter' ? 'Year' : 'Quarter'}
      </button>

      {showTodayButton && (
        <button
          type="button"
          className="nav-button nav-today"
          onClick={handleToday}
          disabled={disabled}
        >
          Today
        </button>
      )}
    </div>
  );
};

export default QuarterNavigation;

