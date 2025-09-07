import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GanttChart } from '../GanttChart';
import { GANTT_ACTIONS, GANTT_NAVIGATION } from '../../constants';

const baseProps = {
  currentYear: 2024,
  currentQuarter: 1 as 1,
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
