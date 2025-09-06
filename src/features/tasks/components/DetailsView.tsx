import React from 'react';
import type { Task } from '@/types';
import { Descriptions, Button } from 'antd';
import { VALIDATION_MESSAGES } from '@/utils/constants';
import { calculateDuration, formatDate, formatDurationEstonian } from '@/utils/dateUtils';

interface DetailsViewProps {
  task: Task;
  onEdit: () => void;
  onBack: () => void;
  onDelete: () => void;
}

export const DetailsView: React.FC<DetailsViewProps> = ({ task, onEdit, onBack, onDelete }) => {
  const getTaskStatus = (startDate: Date, endDate: Date): { status: string; className: string } => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (now < start) {
      return { status: VALIDATION_MESSAGES.STATUS_UPCOMING, className: 'status-upcoming' };
    } else if (now > end) {
      return { status: VALIDATION_MESSAGES.STATUS_COMPLETED, className: 'status-completed' };
    } else {
      return { status: VALIDATION_MESSAGES.STATUS_IN_PROGRESS, className: 'status-active' };
    }
  };

  const status = getTaskStatus(task.startDate, task.endDate);

  return (
    <div className="gantt-body task-details-view">
      <div className="space-y-4">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Ülesande nimi">{task.name}</Descriptions.Item>
          <Descriptions.Item label="Värv">
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: task.color }}
              />
              <span className="text-gray-600 text-sm">{task.color}</span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Alguskuupäev">{formatDate(task.startDate)}</Descriptions.Item>
          <Descriptions.Item label="Lõppkuupäev">{formatDate(task.endDate)}</Descriptions.Item>
          <Descriptions.Item label="Kestus">
            {formatDurationEstonian(calculateDuration(task.startDate, task.endDate))}
          </Descriptions.Item>
          <Descriptions.Item label="Staatus">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
              {status.status}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Ülesande ID">
            <span className="text-gray-500 text-sm font-mono">{task.id}</span>
          </Descriptions.Item>
        </Descriptions>

        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <Button type="primary" onClick={onEdit}>
            Muuda
          </Button>
          <Button onClick={onBack}>Mine tagasi</Button>
          <Button danger onClick={onDelete}>
            Kustuta
          </Button>
        </div>
      </div>
    </div>
  );
};

