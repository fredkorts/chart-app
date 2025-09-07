import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskNotification, type TaskNotificationRef } from '../TaskNotification';
import { TASKS_NOTIFICATIONS } from '../../constants';

const mockSuccess = vi.fn();
const mockWarning = vi.fn();
const mockInfo = vi.fn();

vi.mock('antd', () => ({
  notification: {
    useNotification: () => [
      { success: mockSuccess, warning: mockWarning, info: mockInfo },
      <div />,
    ],
  },
}));

describe('TaskNotification', () => {
  it('showAdd triggers success notification', () => {
    const ref = { current: null } as React.RefObject<TaskNotificationRef>;
    render(<TaskNotification ref={ref} />);

    ref.current?.showAdd();
    expect(mockSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ message: TASKS_NOTIFICATIONS.TASK_ADDED })
    );
  });

  it('showDelete triggers warning notification with task name', () => {
    const ref = { current: null } as React.RefObject<TaskNotificationRef>;
    render(<TaskNotification ref={ref} />);

    ref.current?.showDelete('Example');
    expect(mockWarning).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `${TASKS_NOTIFICATIONS.TASK_DELETED} Example`,
      })
    );
  });

  it('showUpdate triggers info notification', () => {
    const ref = { current: null } as React.RefObject<TaskNotificationRef>;
    render(<TaskNotification ref={ref} />);

    ref.current?.showUpdate();
    expect(mockInfo).toHaveBeenCalledWith(
      expect.objectContaining({ message: TASKS_NOTIFICATIONS.TASK_UPDATED })
    );
  });
});
