import type { Task } from '../../../types';

/**
 * Month information for timeline display
 */
export interface MonthInfo {
  name: string;
  date: Date;
  daysInMonth: number;
}

/**
 * Timeline data containing period information and month breakdown
 */
export interface TimelineData {
  year: number;
  /**
   * Quarter number for quarter view. Undefined when showing a full year.
   */
  quarter?: number;
  /**
   * Indicates whether the timeline represents a single quarter or a full year.
   */
  mode: 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  months: MonthInfo[];
}

/**
 * Extended task data with positioning and display information for task bars
 */
export interface TaskBarData extends Task {
  left: number;        // Position as percentage of timeline width
  width: number;       // Width as percentage of timeline width
  row: number;         // Row index for handling overlapping tasks
  isPartial: boolean;  // Whether task extends beyond current quarter
  continuesLeft: boolean;  // Whether task continues before quarter start
  continuesRight: boolean; // Whether task continues after quarter end
}