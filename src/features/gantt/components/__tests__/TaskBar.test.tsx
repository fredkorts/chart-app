import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskBar } from '../TaskBar';
import type { TaskBarData } from '../../types/gantt.types';

const baseTask: TaskBarData = {
  id: '1',
  name: 'Task 1',
  startDate: new Date(2024, 0, 1),
  endDate: new Date(2024, 0, 5),
  color: '#000',
  left: 10,
  width: 50,
  row: 0,
  isPartial: false,
  continuesLeft: false,
  continuesRight: false,
};

describe('TaskBar', () => {
  const renderBar = (
    task: TaskBarData = baseTask,
    props: Partial<React.ComponentProps<typeof TaskBar>> = {}
  ) => render(<TaskBar task={task} rowHeight={40} taskHeight={20} {...props} />);

  it('renders task name', () => {
    renderBar();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('fires onClick handler', () => {
    const onClick = vi.fn();
    renderBar(baseTask, { onClick });
    fireEvent.click(screen.getByText('Task 1'));
    expect(onClick).toHaveBeenCalled();
  });

  it('handles hover events', () => {
    const onHover = vi.fn();
    const { container } = renderBar(baseTask, { onHover });
    const bar = container.querySelector('.task-bar')!;
    fireEvent.mouseEnter(bar);
    expect(onHover).toHaveBeenCalledWith('1');
    fireEvent.mouseLeave(bar);
    expect(onHover).toHaveBeenCalledWith(null);
  });

  it('shows continuation indicators', () => {
    const { container } = renderBar({ ...baseTask, continuesLeft: true, continuesRight: true });
    expect(container.querySelector('.continuation-left')).toBeInTheDocument();
    expect(container.querySelector('.continuation-right')).toBeInTheDocument();
  });
});
