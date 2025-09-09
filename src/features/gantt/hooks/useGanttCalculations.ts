import { useMemo } from 'react';
import type { Task } from '../../../types';
import {
  getQuarterStart,
  getQuarterEnd,
  isTaskInQuarter,
  getYearStart,
  getYearEnd,
  isTaskInYear,
  getWeekNumber
} from '../../../utils/dateUtils';
import { ESTONIAN_MONTHS } from '../../../utils/constants';
import type { TaskBarData, TimelineData } from '../types/gantt.types';

interface UseGanttCalculationsParams {
  tasks: Task[];
  currentYear: number;
  currentQuarter: 1 | 2 | 3 | 4;
  /**
   * Determines whether calculations are done for a single quarter or a full year.
   * Defaults to quarter view.
   */
  viewMode?: 'quarter' | 'year';
  taskHeight?: number;
  rowHeight?: number;
}

interface UseGanttCalculationsReturn {
  timelineData: TimelineData;
  quarterTasks: Task[];
  taskBars: TaskBarData[];
  chartHeight: number;
  maxRow: number;
  rowHeight: number;
  taskHeight: number;
}

const DEFAULT_TASK_HEIGHT = 38;
const DEFAULT_TASK_GAP = 4;
const DEFAULT_HEADER_HEIGHT = 60;

export const useGanttCalculations = ({
  tasks,
  currentYear,
  currentQuarter,
  viewMode = 'quarter',
  taskHeight = DEFAULT_TASK_HEIGHT,
  rowHeight = DEFAULT_TASK_HEIGHT + DEFAULT_TASK_GAP
}: UseGanttCalculationsParams): UseGanttCalculationsReturn => {

  // Calculate timeline data based on view mode
  const timelineData = useMemo((): TimelineData => {
    const buildWeeks = (startDate: Date, endDate: Date) => {
      const weeks = [] as TimelineData['weeks'];
      const msInDay = 1000 * 60 * 60 * 24;
      const firstWeekStart = new Date(startDate);
      const day = firstWeekStart.getDay();
      const diff = day === 0 ? -6 : 1 - day; // adjust to Monday
      firstWeekStart.setDate(firstWeekStart.getDate() + diff);
      const current = new Date(firstWeekStart);
      while (current <= endDate) {
        const weekStart = new Date(current);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const clampedStart = weekStart < startDate ? startDate : weekStart;
        const clampedEnd = weekEnd > endDate ? endDate : weekEnd;
        const days = Math.floor((clampedEnd.getTime() - clampedStart.getTime()) / msInDay) + 1;
        weeks.push({
          startDate: weekStart,
          endDate: weekEnd,
          weekNumber: getWeekNumber(weekStart),
          days
        });
        current.setDate(current.getDate() + 7);
      }
      return weeks;
    };

    if (viewMode === 'year') {
      const startDate = getYearStart(currentYear);
      const endDate = getYearEnd(currentYear);

      const months = [];
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(currentYear, i, 1);
        const daysInMonth = new Date(currentYear, i + 1, 0).getDate();
        months.push({
          name: ESTONIAN_MONTHS[i],
          date: monthDate,
          daysInMonth
        });
      }

      return {
        year: currentYear,
        mode: 'year',
        startDate,
        endDate,
        months,
        weeks: buildWeeks(startDate, endDate)
      };
    }

    const startDate = getQuarterStart(currentYear, currentQuarter);
    const endDate = getQuarterEnd(currentYear, currentQuarter);

    const months = [];
    const startMonth = (currentQuarter - 1) * 3;

    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(currentYear, startMonth + i, 1);
      const daysInMonth = new Date(currentYear, startMonth + i + 1, 0).getDate();
      months.push({
        name: ESTONIAN_MONTHS[startMonth + i],
        date: monthDate,
        daysInMonth
      });
    }

    return {
      year: currentYear,
      quarter: currentQuarter,
      mode: 'quarter',
      startDate,
      endDate,
      months,
      weeks: buildWeeks(startDate, endDate)
    };
  }, [currentYear, currentQuarter, viewMode]);

  // Filter tasks for current period
  const quarterTasks = useMemo(() => {
    if (viewMode === 'year') {
      return tasks.filter(task => isTaskInYear(task, currentYear));
    }
    return tasks.filter(task =>
      isTaskInQuarter(task, currentYear, currentQuarter)
    );
  }, [tasks, currentYear, currentQuarter, viewMode]);

  // Calculate task bar positions and handle overlaps
  const taskBars = useMemo<TaskBarData[]>(() => {
    if (quarterTasks.length === 0) return [];

    const totalDays = Math.ceil(
      (timelineData.endDate.getTime() - timelineData.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    // Calculate positions for each task
    const bars: TaskBarData[] = quarterTasks.map((task, index) => {
      // Clamp task dates to quarter boundaries for display
      const displayStartDate = task.startDate < timelineData.startDate ? timelineData.startDate : task.startDate;
      const displayEndDate = task.endDate > timelineData.endDate ? timelineData.endDate : task.endDate;

      // Calculate position as percentage
      const startOffset = Math.max(0, 
        (displayStartDate.getTime() - timelineData.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const duration = Math.ceil(
        (displayEndDate.getTime() - displayStartDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      const left = (startOffset / totalDays) * 100;
      const width = (duration / totalDays) * 100;

      return {
        ...task,
        left,
        width: Math.max(width, 1), // Minimum 1% width
        row: index, // Each task gets a unique sequential row
        isPartial: task.startDate < timelineData.startDate || task.endDate > timelineData.endDate,
        continuesLeft: task.startDate < timelineData.startDate,
        continuesRight: task.endDate > timelineData.endDate
      };
    });

    // Return bars in their original order so new tasks are always placed on a new row beneath previous tasks
    return bars;
  }, [quarterTasks, timelineData]);

  // Calculate chart dimensions
  const maxRow = useMemo(
    () => (taskBars.length > 0 ? Math.max(...taskBars.map(t => t.row)) : -1),
    [taskBars]
  );

  const chartHeight = useMemo(
    () => Math.max(200, (maxRow + 1) * rowHeight + DEFAULT_HEADER_HEIGHT + 40),
    [maxRow, rowHeight]
  );

  return { 
    timelineData, 
    quarterTasks, 
    taskBars, 
    chartHeight, 
    maxRow, 
    rowHeight, 
    taskHeight 
  };
};

