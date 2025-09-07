import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { DetailsView } from '../DetailsView';
import { TASKS_ACTIONS } from '../../constants';
import { VALIDATION_MESSAGES } from '../../../../utils/constants';

const baseTask = {
  id: '1',
  name: 'Test Task',
  startDate: new Date(2024, 0, 1),
  endDate: new Date(2024, 0, 5),
  color: '#3B82F6',
};

describe('DetailsView', () => {
  beforeAll(() => {
    // antd uses matchMedia internally; provide a stub for jsdom
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });
  it('renders task details', () => {
    render(
      <DetailsView
        task={baseTask}
        onEdit={vi.fn()}
        onBack={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText(baseTask.name)).toBeInTheDocument();
    expect(screen.getByText(baseTask.color)).toBeInTheDocument();
    expect(screen.getByText('01.01.2024')).toBeInTheDocument();
    expect(screen.getByText('05.01.2024')).toBeInTheDocument();
    expect(screen.getByText(baseTask.id)).toBeInTheDocument();
  });

  it('calls action callbacks', () => {
    const onEdit = vi.fn();
    const onBack = vi.fn();
    const onDelete = vi.fn();

    render(
      <DetailsView
        task={baseTask}
        onEdit={onEdit}
        onBack={onBack}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText(TASKS_ACTIONS.EDIT));
    fireEvent.click(screen.getByText(TASKS_ACTIONS.GO_BACK));
    fireEvent.click(screen.getByText(TASKS_ACTIONS.DELETE));

    expect(onEdit).toHaveBeenCalled();
    expect(onBack).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
  });

  it('shows upcoming status for future task', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1));

    const futureTask = { ...baseTask, startDate: new Date(2024, 0, 2), endDate: new Date(2024, 0, 3) };

    render(
      <DetailsView
        task={futureTask}
        onEdit={vi.fn()}
        onBack={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText(VALIDATION_MESSAGES.STATUS_UPCOMING)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
