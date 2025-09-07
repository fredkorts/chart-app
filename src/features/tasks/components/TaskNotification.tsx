import React, { forwardRef, useImperativeHandle } from 'react';
import { notification } from 'antd';

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
        message: 'Lisasite uue ülesande',
        placement: 'topRight',
        duration: 5,
      });
    },
    showDelete: (taskName: string) => {
      api.warning({
        message: `Kustutasite ülesande ${taskName}`,
        placement: 'topRight',
        duration: 5,
      });
    },
    showUpdate: () => {
      api.info({
        message: 'Muutsite ülesande',
        placement: 'topRight',
        duration: 5,
      });
    },
  }));

  return <>{contextHolder}</>;
});
