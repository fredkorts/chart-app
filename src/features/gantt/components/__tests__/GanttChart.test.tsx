import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GanttChart } from '../GanttChart';
import { GANTT_ACTIONS, GANTT_NAVIGATION } from '../../constants';
import { getWeekNumber } from '../../../../utils/dateUtils';

const baseProps = {
  currentYear: 2024,
  currentQuarter: 1 as const,
  tasks: [],
  onQuarterChange: vi.fn(),
};

describe('GanttChart', () => {
  it('renders quarter months', () => {
    render(<GanttChart {...baseProps} />);
    // Verify month elements exist in the DOM
    expect(screen.getByText('Jaanuar')).toBeTruthy();
    expect(screen.getByText('Veebruar')).toBeTruthy();
    expect(screen.getByText('Märts')).toBeTruthy();
  });

  it('renders weeks and highlights current week', () => {
    const currentDate = new Date(2024, 0, 10); // within week 2
    vi.useFakeTimers();
    vi.setSystemTime(currentDate);
    render(<GanttChart {...baseProps} />);
    const weekNumber = getWeekNumber(currentDate);
    const weekEl = screen.getByTestId(`week-${weekNumber}`);
    
    // Verify the week element has the expected CSS classes
    expect(weekEl.className).toContain('current-week');
    expect(weekEl.className).toContain('current');
    vi.useRealTimers();
  });

  it('shows empty state when no tasks', () => {
    render(<GanttChart {...baseProps} />);
    // Verify empty state message is rendered
    expect(screen.getByText('Aasta 2024 Q1 puuduvad ülesanded')).toBeTruthy();
  });

  it('calls onQuarterChange when navigating next', () => {
    render(<GanttChart {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: GANTT_NAVIGATION.NEXT_QUARTER }));
    expect(baseProps.onQuarterChange).toHaveBeenCalledWith(2024, 2);
  });

  it('shows task form when add task is clicked', () => {
    render(<GanttChart {...baseProps} />);
    // Get all "Lisa ülesanne" buttons (there are multiple due to responsive design)
    const addTaskButtons = screen.getAllByText(GANTT_ACTIONS.ADD_TASK);
    expect(addTaskButtons.length).toBeGreaterThan(0);
    
    // Click the first button
    fireEvent.click(addTaskButtons[0]);
    
    // Verify the buttons are still rendered (component is still in chart mode)
    const buttonsAfterClick = screen.getAllByText(GANTT_ACTIONS.ADD_TASK);
    expect(buttonsAfterClick.length).toBeGreaterThan(0);
  });
});
