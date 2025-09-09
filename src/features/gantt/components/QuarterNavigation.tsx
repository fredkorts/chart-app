import React, { useCallback } from 'react';
import '../gantt.css';
import { useQuarterNavigation } from '../hooks/useQuarterNavigation';
import { Button, Segmented } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { GANTT_NAVIGATION, GANTT_VIEW_MODES, formatQuarterDisplay } from '../constants';

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
      <Button
        type="primary" 
        icon={<LeftOutlined />}
        onClick={handlePrevious}
        disabled={disabled || (viewMode === 'quarter' && !canGoBack)}
        aria-label={viewMode === 'quarter' ? GANTT_NAVIGATION.PREVIOUS_QUARTER : GANTT_NAVIGATION.PREVIOUS_YEAR}
      >
      </Button>

      <div className="quarter-label">
        <h2>
          {formatQuarterDisplay(currentQuarter, currentYear, viewMode)}
        </h2>
      </div>

      <Button 
        type="primary" 
        icon={<RightOutlined />}
        onClick={handleNext}
        disabled={disabled || (viewMode === 'quarter' && !canGoForward)}
        aria-label={viewMode === 'quarter' ? GANTT_NAVIGATION.NEXT_QUARTER : GANTT_NAVIGATION.NEXT_YEAR}
        >
      </Button>

      <Segmented
        options={[GANTT_VIEW_MODES.QUARTER_OPTION, GANTT_VIEW_MODES.YEAR_OPTION]}
        disabled={disabled}
        onChange={() => {
          onViewModeChange?.(viewMode === 'quarter' ? 'year' : 'quarter')
        }}
      />

      {showTodayButton && (
        <Button
          htmlType="button"
          className="nav-button nav-today"
          onClick={handleToday}
          disabled={disabled}
        >
          {GANTT_NAVIGATION.TODAY}
        </Button>
      )}
    </div>
  );
};

export default QuarterNavigation;

