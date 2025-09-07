import type { Task } from "../types";
import { VALIDATION_MESSAGES } from "./constants";

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('et-EE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const parseEstonianDate = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  
  const parts = dateStr.trim().split('.');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  const date = new Date(year, month, day);
  
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null;
  }
  
  return date;
};

export const getQuarterInfo = (date: Date): { year: number; quarter: 1 | 2 | 3 | 4 } => {
  const month = date.getMonth(); // 0-11
  const quarter = Math.floor(month / 3) + 1 as 1 | 2 | 3 | 4;
  
  return {
    year: date.getFullYear(),
    quarter
  };
};

export const getQuarterStart = (year: number, quarter: 1 | 2 | 3 | 4): Date => {
  const month = (quarter - 1) * 3; // Q1=0, Q2=3, Q3=6, Q4=9
  return new Date(year, month, 1);
};

export const getQuarterEnd = (year: number, quarter: 1 | 2 | 3 | 4): Date => {
  const month = (quarter - 1) * 3 + 2; // Q1=2(Mar), Q2=5(Jun), Q3=8(Sep), Q4=11(Dec)
  return new Date(year, month + 1, 0);
};

export const getYearStart = (year: number): Date => new Date(year, 0, 1);

export const getYearEnd = (year: number): Date => new Date(year, 11, 31);

export const formatQuarter = (year: number, quarter: 1 | 2 | 3 | 4): string => {
  return `Q${quarter} ${year}`;
};

export const calculateDuration = (startDate: Date, endDate: Date): number => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

// Format duration in Estonian based on number of days
export const formatDurationEstonian = (days: number): string => {
  if (days === 1) return `1 ${VALIDATION_MESSAGES.DURATION_DAY}`;
  if (days < 7) return `${days} ${VALIDATION_MESSAGES.DURATION_DAYS}`;
  
  if (days < 30) {
    const weeks = Math.ceil(days / 7);
    return weeks === 1 ? `1 ${VALIDATION_MESSAGES.DURATION_WEEK}` : `${weeks} ${VALIDATION_MESSAGES.DURATION_WEEKS}`;
  }
  
  if (days < 365) {
    const months = Math.ceil(days / 30);
    return months === 1 ? `1 ${VALIDATION_MESSAGES.DURATION_MONTH}` : `${months} ${VALIDATION_MESSAGES.DURATION_MONTHS}`;
  }
  
  const years = Math.ceil(days / 365);
  return years === 1 ? `1 ${VALIDATION_MESSAGES.DURATION_YEAR}` : `${years} ${VALIDATION_MESSAGES.DURATION_YEARS}`;
};

// Generate unique task ID
export const generateTaskId = (): string => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isTaskInQuarter = (task: Task, year: number, quarter: 1 | 2 | 3 | 4): boolean => {
  const quarterStart = getQuarterStart(year, quarter);
  const quarterEnd = getQuarterEnd(year, quarter);
  
  // Task is visible if it overlaps with the quarter at all
  return task.startDate <= quarterEnd && task.endDate >= quarterStart;
};

export const isTaskInYear = (task: Task, year: number): boolean => {
  const yearStart = getYearStart(year);
  const yearEnd = getYearEnd(year);
  return task.startDate <= yearEnd && task.endDate >= yearStart;
};

/**
 * Calculate ISO week number for a given date
 */
export const getWeekNumber = (date: Date): number => {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};