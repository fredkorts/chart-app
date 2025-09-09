import { useCallback, useMemo, useState } from 'react';
import { getQuarterInfo, getQuarterStart, getQuarterEnd } from '../../../utils/dateUtils';

export interface QuarterInfo {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  startDate: Date;
  endDate: Date;
  label: string;
}

interface UseQuarterNavigationOptions {
  onNavigate?: (year: number, quarter: 1 | 2 | 3 | 4) => void;
  bounds?: { minYear: number; maxYear: number };
}

interface UseQuarterNavigationResult {
  currentYear: number;
  currentQuarter: 1 | 2 | 3 | 4;
  goToPrevious: () => void;
  goToNext: () => void;
  goToQuarter: (year: number, quarter: 1 | 2 | 3 | 4) => void;
  goToToday: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  quarterInfo: QuarterInfo;
}

/**
 * Manage quarter navigation state and expose helpers for moving between
 * quarters. The hook enforces optional bounds and triggers the optional
 * callback whenever navigation occurs.
 */
export const useQuarterNavigation = (
  initialYear?: number,
  initialQuarter?: 1 | 2 | 3 | 4,
  options: UseQuarterNavigationOptions = {}
): UseQuarterNavigationResult => {
  const nowInfo = getQuarterInfo(new Date());
  const [year, setYear] = useState(initialYear ?? nowInfo.year);
  const [quarter, setQuarter] = useState<1 | 2 | 3 | 4>(
    initialQuarter ?? nowInfo.quarter
  );

  const goToQuarter = useCallback(
    (y: number, q: 1 | 2 | 3 | 4) => {
      if (options.bounds) {
        if (y < options.bounds.minYear || y > options.bounds.maxYear) return;
      }
      setYear(y);
      setQuarter(q);
      options.onNavigate?.(y, q);
    },
    [options]
  );

  const goToPrevious = useCallback(() => {
    let y = year;
    let q = (quarter - 1) as 1 | 2 | 3 | 4;
    if (q < 1) {
      q = 4;
      y -= 1;
    }
    if (options.bounds && y < options.bounds.minYear) return;
    goToQuarter(y, q);
  }, [year, quarter, goToQuarter, options.bounds]);

  const goToNext = useCallback(() => {
    let y = year;
    let q = (quarter + 1) as 1 | 2 | 3 | 4;
    if (q > 4) {
      q = 1;
      y += 1;
    }
    if (options.bounds && y > options.bounds.maxYear) return;
    goToQuarter(y, q);
  }, [year, quarter, goToQuarter, options.bounds]);

  const goToToday = useCallback(() => {
    const info = getQuarterInfo(new Date());
    goToQuarter(info.year, info.quarter);
  }, [goToQuarter]);

  const canGoBack = useMemo(() => {
    if (!options.bounds) return true;
    return (
      year > options.bounds.minYear ||
      (year === options.bounds.minYear && quarter > 1)
    );
  }, [options.bounds, year, quarter]);

  const canGoForward = useMemo(() => {
    if (!options.bounds) return true;
    return (
      year < options.bounds.maxYear ||
      (year === options.bounds.maxYear && quarter < 4)
    );
  }, [options.bounds, year, quarter]);

  const quarterInfo = useMemo<QuarterInfo>(
    () => ({
      year,
      quarter,
      startDate: getQuarterStart(year, quarter),
      endDate: getQuarterEnd(year, quarter),
      label: `Q${quarter} ${year}`
    }),
    [year, quarter]
  );

  return {
    currentYear: year,
    currentQuarter: quarter,
    goToPrevious,
    goToNext,
    goToQuarter,
    goToToday,
    canGoBack,
    canGoForward,
    quarterInfo
  };
};

export default useQuarterNavigation;

