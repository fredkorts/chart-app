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
