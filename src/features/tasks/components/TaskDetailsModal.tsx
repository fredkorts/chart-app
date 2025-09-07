import React, { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { TaskForm } from './TaskForm';
import { formatDate, calculateDuration, formatDurationEstonian } from '@/utils/dateUtils';
import { VALIDATION_MESSAGES } from '@/utils/constants';
import { ErrorDisplay } from '@/components';
import {
  Button,
  Modal,
  Spin,
  Descriptions,
  Tag,
  Typography,
  Flex,
  Space
} from 'antd';
import type { TaskDetailsModalProps, ModalMode } from '../types/tasks.types';

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  readOnly = false
}) => {
  const [mode, setMode] = useState<ModalMode>('view');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen && task) {
      setMode('view');
      setError(null);
    }
  }, [isOpen, task]);

  // Get task status in Estonian
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

  // Handle edit task
  const handleEditTask = async (updatedTaskData: Omit<Task, 'id'>) => {
    if (!task || !onEdit) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await onEdit(task.id, updatedTaskData);
      
      if (result.success) {
        setMode('view');
      } else if (result.errors) {
        // Let the form handle validation errors
        setError(VALIDATION_MESSAGES.VALIDATION_FAILED);
      } else {
        setError(VALIDATION_MESSAGES.UPDATE_TASK_FAILED);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : VALIDATION_MESSAGES.UPDATE_TASK_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = async () => {
    if (!task || !onDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await onDelete(task.id);
      
      if (result.success) {
        onClose();
      } else {
        setError(VALIDATION_MESSAGES.DELETE_TASK_FAILED);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : VALIDATION_MESSAGES.DELETE_TASK_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert Task to TaskFormData for editing
  const getTaskFormData = () => {
    if (!task) return { name: '', startDateStr: '', endDateStr: '' };
    
    return {
      name: task.name,
      startDateStr: formatDate(task.startDate),
      endDateStr: formatDate(task.endDate)
    };
  };

  // Get modal title based on mode
  const getModalTitle = () => {
    switch (mode) {
      case 'view':
        return 'Ülesande detailid';
      case 'edit':
        return 'Muuda ülesannet';
      case 'confirm-delete':
        return 'Kinnita kustutamine';
      default:
        return 'Ülesanne';
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    if (!isLoading) {
      if (mode === 'edit' || mode === 'confirm-delete') {
        setMode('view');
      } else {
        onClose();
      }
    }
  };

  if (!task) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={handleModalClose}
      title={getModalTitle()}
      footer={null}
      centered
      width={720}
    >
      {isLoading && (
        <Flex align="center" justify="center" style={{ padding: 32 }}>
          <Spin size="large" style={{ marginRight: 12 }} />
          <Typography.Text>Töötleb...</Typography.Text>
        </Flex>
      )}

      {error && (
        <ErrorDisplay errors={[{ field: 'general', message: error }]} />
      )}

      {!isLoading && (
        <>
          {mode === 'view' && (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Ülesande nimi">{task.name}</Descriptions.Item>
                <Descriptions.Item label="Värv">
                  <Flex align="center" gap="small">
                    <div
                      style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid #d1d5db', backgroundColor: task.color }}
                      aria-label={`Ülesande värv: ${task.color}`}
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
                  <Tag color={getTaskStatus(task.startDate, task.endDate).color}>
                    {getTaskStatus(task.startDate, task.endDate).status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ülesande ID">
                  <Typography.Text type="secondary" code>{task.id}</Typography.Text>
                </Descriptions.Item>
              </Descriptions>

              {!readOnly && (
                <Flex gap="small" style={{ paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                  <Button
                    type="primary"
                    onClick={() => setMode('edit')}
                    disabled={isLoading}
                  >
                    Muuda
                  </Button>
                  <Button
                    danger
                    onClick={() => setMode('confirm-delete')}
                    disabled={isLoading}
                  >
                    Kustuta
                  </Button>
                </Flex>
              )}
            </Space>
          )}

          {mode === 'edit' && (
            <TaskForm
              onSubmit={handleEditTask}
              initialData={getTaskFormData()}
              submitLabel="Salvesta muudatused"
              onCancel={() => setMode('view')}
            />
          )}

          {mode === 'confirm-delete' && (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Typography.Paragraph>
                  Kas olete kindel, et soovite kustutada ülesande <strong>"{task.name}"</strong>?
                </Typography.Paragraph>
                <Typography.Paragraph type="danger">
                  Seda toimingut ei saa tagasi võtta.
                </Typography.Paragraph>
              </div>

              <Flex gap="small" justify="center" style={{ paddingTop: 16 }}>
                <Button onClick={() => setMode('view')} disabled={isLoading}>
                  Tühista
                </Button>
                <Button danger onClick={handleDeleteTask} disabled={isLoading}>
                  {isLoading ? 'Kustutan...' : 'Jah, kustuta'}
                </Button>
              </Flex>
            </Space>
          )}
        </>
      )}
    </Modal>
  );
};
