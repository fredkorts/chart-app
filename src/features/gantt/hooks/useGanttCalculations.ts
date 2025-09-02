/**
 * useGanttCalculations Hook
 * 
 * A custom React hook that handles all the complex calculations required for rendering
 * a Gantt chart. This hook encapsulates the positioning logic, overlap resolution,
 * and timeline calculations that are currently embedded in the GanttChart component.
 * 
 * Purpose:
 * - Extract calculation logic from UI components for better separation of concerns
 * - Provide reusable positioning calculations for different Gantt chart views
 * - Optimize performance through memoization of expensive calculations
 * - Enable easier testing of calculation logic in isolation
 * 
 * Input Parameters:
 * - tasks: Task[] - Array of tasks to process
 * - timelineData: TimelineData - Current quarter/period information
 * - options?: GanttCalculationOptions - Configuration for calculations
 * 
 * Return Value:
 * - taskBars: TaskBarData[] - Tasks with calculated positioning data
 * - timelineMetrics: TimelineMetrics - Calculated timeline dimensions and scales
 * - chartDimensions: ChartDimensions - Overall chart size requirements
 * - gridLines: GridLineData[] - Calculated grid line positions
 * 
 * Core Calculations:
 * 
 * 1. Timeline Positioning:
 *    - Convert dates to percentage-based positions within the quarter
 *    - Calculate task bar widths based on duration relative to timeline
 *    - Handle edge cases where tasks extend beyond quarter boundaries
 *    - Apply minimum width constraints for visibility
 * 
 * 2. Overlap Resolution:
 *    - Detect overlapping tasks using date range intersections
 *    - Assign tasks to different visual rows to prevent overlaps
 *    - Optimize row assignment for minimal chart height
 *    - Handle complex multi-task overlaps efficiently
 * 
 * 3. Visual Indicators:
 *    - Calculate continuation indicators for partial tasks
 *    - Determine which tasks need left/right continuation arrows
 *    - Mark tasks that span multiple quarters
 *    - Generate tooltip positioning data
 * 
 * 4. Grid Calculations:
 *    - Calculate month column positions and widths
 *    - Generate week division lines (future enhancement)
 *    - Determine optimal grid density based on zoom level
 *    - Calculate responsive breakpoints for different screen sizes
 * 
 * Performance Optimizations:
 * - useMemo for expensive calculations that depend on tasks/timeline
 * - Incremental recalculation when only specific tasks change
 * - Debounced calculations for resize/zoom operations
 * - Efficient sorting algorithms for overlap detection
 * - Cached results for repeated calculations
 * 
 * Algorithm Details:
 * 
 * Overlap Resolution Algorithm:
 * 1. Sort tasks by start date for consistent processing
 * 2. Initialize empty rows array
 * 3. For each task, find first available row without conflicts
 * 4. If no row available, create new row
 * 5. Assign task to row and update row's task list
 * 
 * Position Calculation:
 * 1. Calculate total days in current quarter
 * 2. Find task's start offset from quarter start (in days)
 * 3. Calculate task duration within visible quarter
 * 4. Convert to percentages: left = (offset/totalDays) * 100
 * 5. Width = (duration/totalDays) * 100, minimum 1%
 * 
 * Edge Cases Handled:
 * - Tasks starting before quarter begins
 * - Tasks ending after quarter ends
 * - Single-day tasks (minimum width enforcement)
 * - Tasks spanning entire quarter or beyond
 * - Empty task lists
 * - Invalid date ranges
 * 
 * Future Enhancements:
 * - Support for different time scales (month, week, day views)
 * - Resource allocation calculations for capacity planning
 * - Critical path analysis for project dependencies
 * - Gantt zoom level calculations
 * - Multi-project timeline calculations
 * - Milestone positioning logic
 * 
 * Integration:
 * - Uses existing date utilities from utils/dateUtils.ts
 * - Compatible with Task type from types/index.ts
 * - Works with TimelineData interface from GanttChart
 * - Supports Estonian localization requirements
 * - Integrates with existing task management system
 * 
 * Usage Example:
 * ```typescript
 * const { taskBars, chartDimensions, timelineMetrics } = useGanttCalculations(
 *   tasks,
 *   timelineData,
 *   { minimumTaskWidth: 1, rowHeight: 32 }
 * );
 * ```
 */
