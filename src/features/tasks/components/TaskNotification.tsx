import { forwardRef, useImperativeHandle } from 'react';
import { notification } from 'antd';
import { TASKS_NOTIFICATIONS } from '../constants';

export interface TaskNotificationRef {
  showAdd: () => void;
  showDelete: (taskName: string) => void;
  showUpdate: () => void;
}

export const TaskNotification = forwardRef<TaskNotificationRef>((_, ref) => {
  const [api, contextHolder] = notification.useNotification();

  useImperativeHandle(ref, () => ({
    showAdd: () => {
      api.success({
        message: TASKS_NOTIFICATIONS.TASK_ADDED,
        placement: 'topRight',
        duration: 5,
      });
    },
    showDelete: (taskName: string) => {
      api.warning({
        message: `${TASKS_NOTIFICATIONS.TASK_DELETED} ${taskName}`,
        placement: 'topRight',
        duration: 5,
      });
    },
    showUpdate: () => {
      api.info({
        message: TASKS_NOTIFICATIONS.TASK_UPDATED,
        placement: 'topRight',
        duration: 5,
      });
    },
  }));

  return <>{contextHolder}</>;
});
