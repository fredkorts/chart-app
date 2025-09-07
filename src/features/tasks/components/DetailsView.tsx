import React from 'react';
import type { Task } from '@/types';
import { Descriptions, Button, Flex, Tag, Typography } from 'antd';
import { VALIDATION_MESSAGES } from '@/utils/constants';
import { calculateDuration, formatDate, formatDurationEstonian } from '@/utils/dateUtils';
import { TASKS_LABELS, TASKS_ACTIONS, formatTaskColorAria } from '../constants';

interface DetailsViewProps {
  task: Task;
  onEdit: () => void;
  onBack: () => void;
  onDelete: () => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({ task, onEdit, onBack, onDelete }) => {
  const getTaskStatus = (startDate: Date, endDate: Date): { status: string; color: string } => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (now < start) {
      return { status: VALIDATION_MESSAGES.STATUS_UPCOMING, color: 'blue' };
    } else if (now > end) {
      return { status: VALIDATION_MESSAGES.STATUS_COMPLETED, color: 'default' };
    } else {
      return { status: VALIDATION_MESSAGES.STATUS_IN_PROGRESS, color: 'green' };
    }
  };

  const status = getTaskStatus(task.startDate, task.endDate);

  return (
    <div className="gantt-body task-details-view">
      <Descriptions column={1} bordered>
        <Descriptions.Item label={TASKS_LABELS.TASK_NAME}>{task.name}</Descriptions.Item>
        <Descriptions.Item label={TASKS_LABELS.COLOR}>
          <Flex align="center" gap="small">
            <div
              style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #d1d5db', backgroundColor: task.color }}
              aria-label={formatTaskColorAria(task.color || '#000000')}
            />
            <Typography.Text type="secondary">{task.color}</Typography.Text>
          </Flex>
        </Descriptions.Item>
        <Descriptions.Item label={TASKS_LABELS.START_DATE}>{formatDate(task.startDate)}</Descriptions.Item>
        <Descriptions.Item label={TASKS_LABELS.END_DATE}>{formatDate(task.endDate)}</Descriptions.Item>
        <Descriptions.Item label={TASKS_LABELS.DURATION}>
          {formatDurationEstonian(calculateDuration(task.startDate, task.endDate))}
        </Descriptions.Item>
        <Descriptions.Item label={TASKS_LABELS.STATUS}>
          <Tag color={status.color}>{status.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label={TASKS_LABELS.TASK_ID}>
          <Typography.Text type="secondary" code>{task.id}</Typography.Text>
        </Descriptions.Item>
      </Descriptions>

      <div className="form-actions edit-form-actions">
        <Flex gap="small" wrap>
          <Button type="primary" onClick={onEdit}>{TASKS_ACTIONS.EDIT}</Button>
          <Button onClick={onBack}>{TASKS_ACTIONS.GO_BACK}</Button>
          <Button danger onClick={onDelete}>{TASKS_ACTIONS.DELETE}</Button>
        </Flex>
      </div>
    </div>
  );
};

