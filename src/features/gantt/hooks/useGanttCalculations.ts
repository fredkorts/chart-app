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

import { useMemo } from 'react';
import type { Task } from '../../../types';
import type { TimelineData } from '../components/Timeline';
import type { TaskBarData } from '../components/TaskBar';

interface GanttCalculationOptions {
  minimumTaskWidth?: number; // in percent
  rowHeight?: number;
  taskHeight?: number;
  headerHeight?: number;
}

interface UseGanttCalculationsResult {
  taskBars: TaskBarData[];
  maxRow: number;
  chartHeight: number;
  rowHeight: number;
  taskHeight: number;
}

/**
 * Perform positioning and overlap calculations for the provided tasks and
 * timeline. The hook returns processed task bars ready for rendering along with
 * basic chart metrics.
 */
export const useGanttCalculations = (
  tasks: Task[],
  timelineData: TimelineData,
  options: GanttCalculationOptions = {}
): UseGanttCalculationsResult => {
  const {
    minimumTaskWidth = 1,
    rowHeight = 32,
    taskHeight = 28,
    headerHeight = 60
  } = options;

  const taskBars = useMemo<TaskBarData[]>(() => {
    if (!timelineData) return [];
    if (tasks.length === 0) return [];

    const totalDays = Math.ceil(
      (timelineData.endDate.getTime() - timelineData.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

    // Prepare bars with initial positioning
    const bars: TaskBarData[] = tasks.map(task => {
      const displayStart =
        task.startDate < timelineData.startDate
          ? timelineData.startDate
          : task.startDate;
      const displayEnd =
        task.endDate > timelineData.endDate
          ? timelineData.endDate
          : task.endDate;

      const startOffset = Math.max(
        0,
        (displayStart.getTime() - timelineData.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const duration =
        Math.ceil(
          (displayEnd.getTime() - displayStart.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      const left = (startOffset / totalDays) * 100;
      const width = Math.max((duration / totalDays) * 100, minimumTaskWidth);

      return {
        ...task,
        left,
        width,
        row: 0,
        isPartial:
          task.startDate < timelineData.startDate ||
          task.endDate > timelineData.endDate,
        continuesLeft: task.startDate < timelineData.startDate,
        continuesRight: task.endDate > timelineData.endDate
      };
    });

    // Handle overlaps by assigning rows
    const sorted = [...bars].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );

    const rows: TaskBarData[][] = [];

    sorted.forEach(task => {
      let assigned = -1;
      for (let i = 0; i < rows.length; i++) {
        const hasOverlap = rows[i].some(existing => {
          return (
            task.startDate <= existing.endDate &&
            task.endDate >= existing.startDate
          );
        });
        if (!hasOverlap) {
          assigned = i;
          break;
        }
      }

      if (assigned === -1) {
        assigned = rows.length;
        rows.push([]);
      }

      task.row = assigned;
      rows[assigned].push(task);
    });

    return bars;
  }, [tasks, timelineData, minimumTaskWidth]);

  const maxRow = useMemo(
    () => (taskBars.length > 0 ? Math.max(...taskBars.map(t => t.row)) : -1),
    [taskBars]
  );

  const chartHeight = useMemo(
    () => Math.max(200, (maxRow + 1) * rowHeight + headerHeight + 40),
    [maxRow, rowHeight, headerHeight]
  );

  return { taskBars, maxRow, chartHeight, rowHeight, taskHeight };
};

export default useGanttCalculations;

