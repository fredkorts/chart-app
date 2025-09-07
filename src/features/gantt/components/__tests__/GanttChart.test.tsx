import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GanttChart } from '../GanttChart';
import { GANTT_ACTIONS, GANTT_NAVIGATION } from '../../constants';
import { getWeekNumber } from '@/utils/dateUtils';

const baseProps = {
  currentYear: 2024,
  currentQuarter: 1 as const,
  tasks: [],
  onQuarterChange: vi.fn(),
};

describe('GanttChart', () => {
  it('renders quarter months', () => {
    render(<GanttChart {...baseProps} />);
    expect(screen.getByText('Jaanuar')).toBeInTheDocument();
    expect(screen.getByText('Veebruar')).toBeInTheDocument();
    expect(screen.getByText('Märts')).toBeInTheDocument();
  });

  it('renders weeks and highlights current week', () => {
    const currentDate = new Date(2024, 0, 10); // within week 2
    vi.useFakeTimers();
    vi.setSystemTime(currentDate);
    render(<GanttChart {...baseProps} />);
    const weekNumber = getWeekNumber(currentDate);
    const weekEl = screen.getByTestId(`week-${weekNumber}`);
    expect(weekEl).toHaveClass('current-week');
    expect(weekEl).toHaveClass('current');
    vi.useRealTimers();
  });

  it('shows empty state when no tasks', () => {
    render(<GanttChart {...baseProps} />);
    expect(screen.getByText('Aasta 2024 Q1 puuduvad ülesanded')).toBeInTheDocument();
  });

  it('calls onQuarterChange when navigating next', () => {
    render(<GanttChart {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: GANTT_NAVIGATION.NEXT_QUARTER }));
    expect(baseProps.onQuarterChange).toHaveBeenCalledWith(2024, 2);
  });

  it('shows task form when add task is clicked', () => {
    render(<GanttChart {...baseProps} />);
    fireEvent.click(screen.getByText(GANTT_ACTIONS.ADD_TASK));
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });
});
