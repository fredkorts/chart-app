import React from 'react';
import type { Task } from '@/types';
import { Descriptions, Button, Flex, Tag, Typography } from 'antd';
import { VALIDATION_MESSAGES } from '@/utils/constants';
import { calculateDuration, formatDate, formatDurationEstonian } from '@/utils/dateUtils';

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
        <Descriptions.Item label="Ülesande nimi">{task.name}</Descriptions.Item>
        <Descriptions.Item label="Värv">
          <Flex align="center" gap="small">
            <div
              style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #d1d5db', backgroundColor: task.color }}
            />
            <Typography.Text type="secondary">{task.color}</Typography.Text>
          </Flex>
        </Descriptions.Item>
        <Descriptions.Item label="Alguskuupäev">{formatDate(task.startDate)}</Descriptions.Item>
        <Descriptions.Item label="Lõppkuupäev">{formatDate(task.endDate)}</Descriptions.Item>
        <Descriptions.Item label="Kestus">
          {formatDurationEstonian(calculateDuration(task.startDate, task.endDate))}
        </Descriptions.Item>
        <Descriptions.Item label="Staatus">
          <Tag color={status.color}>{status.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ülesande ID">
          <Typography.Text type="secondary" code>{task.id}</Typography.Text>
        </Descriptions.Item>
      </Descriptions>

      <div className="form-actions edit-form-actions">
        <Flex gap="small" wrap>
          <Button type="primary" onClick={onEdit}>Muuda</Button>
          <Button onClick={onBack}>Mine tagasi</Button>
          <Button danger onClick={onDelete}>Kustuta</Button>
        </Flex>
      </div>
    </div>
  );
};

