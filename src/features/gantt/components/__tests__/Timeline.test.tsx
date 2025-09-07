import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Timeline } from '../Timeline';
import type { TimelineData, TaskBarData } from '../../types/gantt.types';

const timelineData: TimelineData = {
  year: 2024,
  quarter: 1,
  mode: 'quarter',
  startDate: new Date(2024, 0, 1),
  endDate: new Date(2024, 2, 31),
  months: [
    { name: 'Jaanuar', date: new Date(2024, 0, 1), daysInMonth: 31 },
    { name: 'Veebruar', date: new Date(2024, 1, 1), daysInMonth: 29 },
    { name: 'Märts', date: new Date(2024, 2, 1), daysInMonth: 31 },
  ],
};

const task1: TaskBarData = {
  id: '1',
  name: 'Task 1',
  startDate: new Date(2024, 0, 1),
  endDate: new Date(2024, 0, 5),
  color: '#000',
  left: 0,
  width: 30,
  row: 0,
  isPartial: false,
  continuesLeft: false,
  continuesRight: false,
};

const task2: TaskBarData = { ...task1, id: '2', name: 'Task 2', left: 40 };

describe('Timeline', () => {
  it('renders month columns for each month', () => {
    const { container } = render(
      <Timeline timelineData={timelineData} tasks={[]} rowHeight={40} taskHeight={20} />
    );
    expect(container.getElementsByClassName('month-column').length).toBe(3);
  });

  it('renders task bars', () => {
    render(
      <Timeline timelineData={timelineData} tasks={[task1, task2]} rowHeight={40} taskHeight={20} />
    );
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('calls onTaskClick when a task is clicked', () => {
    const onTaskClick = vi.fn();
    render(
      <Timeline timelineData={timelineData} tasks={[task1]} rowHeight={40} taskHeight={20} onTaskClick={onTaskClick} />
    );
    fireEvent.click(screen.getByText('Task 1'));
    expect(onTaskClick).toHaveBeenCalled();
  });

  it('marks task as hovered on mouse enter', () => {
    const { container } = render(
      <Timeline timelineData={timelineData} tasks={[task1]} rowHeight={40} taskHeight={20} />
    );
    const bar = container.querySelector('.task-bar')!;
    fireEvent.mouseEnter(bar);
    expect(bar).toHaveClass('hovered');
    fireEvent.mouseLeave(bar);
    expect(bar).not.toHaveClass('hovered');
  });
});
