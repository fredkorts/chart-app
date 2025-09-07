import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import '@testing-library/jest-dom';
import { TaskForm } from '../TaskForm';
import { TASKS_ACTIONS } from '../../constants';
import { VALIDATION_MESSAGES } from '../../../../utils/constants';
import { formatDate } from '../../../../utils/dateUtils';

describe('TaskForm', () => {
  beforeAll(() => {
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

  it('submits valid form data', async () => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 3);

    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <TaskForm
        onSubmit={onSubmit}
        initialData={{
          name: 'My Task',
          startDateStr: formatDate(start),
          endDateStr: formatDate(end),
        }}
        submitLabel={TASKS_ACTIONS.ADD_TASK}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: TASKS_ACTIONS.ADD_TASK })
    );

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'My Task',
        startDate: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
        endDate: new Date(end.getFullYear(), end.getMonth(), end.getDate()),
        color: expect.any(String),
      })
    );
  });

  it('shows validation errors when fields are empty', () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} submitLabel={TASKS_ACTIONS.ADD_TASK} />);

    fireEvent.click(
      screen.getByRole('button', { name: TASKS_ACTIONS.ADD_TASK })
    );

    expect(screen.getByText(VALIDATION_MESSAGES.TASK_NAME_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(VALIDATION_MESSAGES.START_DATE_REQUIRED)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByText(TASKS_ACTIONS.CANCEL));
    expect(onCancel).toHaveBeenCalled();
  });
});
