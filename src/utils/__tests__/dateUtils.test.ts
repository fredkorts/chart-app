import { describe, it, expect } from 'vitest';
import {
  parseEstonianDate,
  formatDate,
  getQuarterInfo,
  getQuarterStart,
  getQuarterEnd,
  calculateDuration,
  isTaskInQuarter
} from '../dateUtils';
import type { Task } from '../../types';

describe('dateUtils', () => {
  describe('parseEstonianDate', () => {
    it('should parse valid Estonian date format', () => {
      const result = parseEstonianDate('23.01.2023');
      expect(result).toEqual(new Date(2023, 0, 23));
    });

    it('should handle single digit days and months', () => {
      const result = parseEstonianDate('1.1.2023');
      expect(result).toEqual(new Date(2023, 0, 1));
    });

    it('should return null for invalid formats', () => {
      expect(parseEstonianDate('')).toBeNull();
      expect(parseEstonianDate('invalid')).toBeNull();
      expect(parseEstonianDate('23/01/2023')).toBeNull();
      expect(parseEstonianDate('23.01')).toBeNull();
      expect(parseEstonianDate('23.01.23.extra')).toBeNull();
    });

    it('should return null for invalid dates', () => {
      expect(parseEstonianDate('32.01.2023')).toBeNull(); // Invalid day
      expect(parseEstonianDate('01.13.2023')).toBeNull(); // Invalid month
      expect(parseEstonianDate('29.02.2023')).toBeNull(); // Invalid Feb 29 in non-leap year
    });

    it('should handle leap years correctly', () => {
      expect(parseEstonianDate('29.02.2024')).toEqual(new Date(2024, 1, 29)); // Valid leap year
      expect(parseEstonianDate('29.02.2023')).toBeNull(); // Invalid non-leap year
    });

    it('should handle edge cases', () => {
      expect(parseEstonianDate(null as never)).toBeNull();
      expect(parseEstonianDate(undefined as never)).toBeNull();
      expect(parseEstonianDate('  23.01.2023  ')).toEqual(new Date(2023, 0, 23)); // Whitespace
    });
  });

  describe('formatDate', () => {
    it('should format date to Estonian format', () => {
      const date = new Date(2023, 0, 23);
      expect(formatDate(date)).toBe('23.01.2023');
    });

    it('should handle single digit days and months', () => {
      const date = new Date(2023, 0, 1);
      expect(formatDate(date)).toBe('01.01.2023');
    });
  });

  describe('getQuarterInfo', () => {
    it('should identify quarters correctly', () => {
      expect(getQuarterInfo(new Date(2023, 0, 1))).toEqual({ year: 2023, quarter: 1 }); // Jan
      expect(getQuarterInfo(new Date(2023, 3, 1))).toEqual({ year: 2023, quarter: 2 }); // Apr
      expect(getQuarterInfo(new Date(2023, 6, 1))).toEqual({ year: 2023, quarter: 3 }); // Jul
      expect(getQuarterInfo(new Date(2023, 9, 1))).toEqual({ year: 2023, quarter: 4 }); // Oct
    });
  });

  describe('getQuarterStart and getQuarterEnd', () => {
    it('should get correct quarter boundaries', () => {
      expect(getQuarterStart(2023, 1)).toEqual(new Date(2023, 0, 1));  // Jan 1
      expect(getQuarterEnd(2023, 1)).toEqual(new Date(2023, 2, 31));   // Mar 31
      
      expect(getQuarterStart(2023, 2)).toEqual(new Date(2023, 3, 1));  // Apr 1
      expect(getQuarterEnd(2023, 2)).toEqual(new Date(2023, 5, 30));   // Jun 30
    });
  });

  describe('calculateDuration', () => {
    it('should calculate duration in days', () => {
      const start = new Date(2023, 0, 1);
      const end = new Date(2023, 0, 10);
      expect(calculateDuration(start, end)).toBe(9);
    });

    it('should handle same day', () => {
      const date = new Date(2023, 0, 1);
      expect(calculateDuration(date, date)).toBe(0);
    });
  });

  describe('isTaskInQuarter', () => {
    const createTask = (start: string, end: string): Task => ({
      id: '1',
      name: 'Test Task',
      startDate: parseEstonianDate(start)!,
      endDate: parseEstonianDate(end)!,
    });

    it('should detect tasks fully within quarter', () => {
      const task = createTask('15.01.2023', '15.02.2023');
      expect(isTaskInQuarter(task, 2023, 1)).toBe(true);
    });

    it('should detect tasks spanning multiple quarters', () => {
      const task = createTask('15.02.2023', '15.04.2023'); // Spans Q1-Q2
      expect(isTaskInQuarter(task, 2023, 1)).toBe(true);
      expect(isTaskInQuarter(task, 2023, 2)).toBe(true);
    });

    it('should exclude tasks outside quarter', () => {
      const task = createTask('15.04.2023', '15.05.2023'); // Q2 only
      expect(isTaskInQuarter(task, 2023, 1)).toBe(false);
      expect(isTaskInQuarter(task, 2023, 2)).toBe(true);
    });
  });
});