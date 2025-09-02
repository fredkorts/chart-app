import React, { useState, useEffect } from 'react';
import type { Task } from '../../../types';
import { TaskForm } from './TaskForm';
import { formatDate, calculateDuration, formatDurationEstonian } from '../../../utils/dateUtils';
import { VALIDATION_MESSAGES } from '../../../utils/constants';
import { Modal, Button, LoadingSpinner, ErrorDisplay } from '../../../components';
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
      // Handle validation errors - you can either show a general message
      // or extract specific error messages from result.errors
      const errorMessages = Object.values(result.errors).join(', ');
      setError(errorMessages || VALIDATION_MESSAGES.VALIDATION_FAILED);
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
    } else if (result.error) {
      // Handle single error message from delete operation
      setError(result.error);
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
      isOpen={isOpen} 
      onClose={handleModalClose} 
      title={getModalTitle()}
      size="lg"
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" className="mr-3" />
          <span className="text-gray-600">Töötleb...</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <ErrorDisplay 
          errors={[{ field: 'general', message: error }]} 
          language="et"
          className="mb-4"
        />
      )}

      {/* Content based on mode */}
      {!isLoading && (
        <>
          {mode === 'view' && (
            <div className="space-y-4">
              {/* Task Details */}
              <div className="grid grid-cols-1 gap-4">
                {/* Task Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Ülesande nimi:</label>
                  <div className="text-gray-900 font-medium">{task.name}</div>
                </div>

                {/* Task Color */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Värv:</label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: task.color }}
                      aria-label={`Ülesande värv: ${task.color}`}
                    />
                    <span className="text-gray-600 text-sm">{task.color}</span>
                  </div>
                </div>

                {/* Start Date */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Alguskuupäev:</label>
                  <div className="text-gray-900">{formatDate(task.startDate)}</div>
                </div>

                {/* End Date */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Lõppkuupäev:</label>
                  <div className="text-gray-900">{formatDate(task.endDate)}</div>
                </div>

                {/* Duration */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Kestus:</label>
                  <div className="text-gray-900">
                    {formatDurationEstonian(calculateDuration(task.startDate, task.endDate))}
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Staatus:</label>
                  <div className="text-gray-900">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      getTaskStatus(task.startDate, task.endDate).className
                    }`}>
                      {getTaskStatus(task.startDate, task.endDate).status}
                    </span>
                  </div>
                </div>

                {/* Task ID */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Ülesande ID:</label>
                  <div className="text-gray-500 text-sm font-mono">{task.id}</div>
                </div>
              </div>

              {/* Action Buttons */}
              {!readOnly && (
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={() => setMode('edit')}
                    disabled={isLoading}
                  >
                    Muuda
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setMode('confirm-delete')}
                    disabled={isLoading}
                  >
                    Kustuta
                  </Button>
                </div>
              )}
            </div>
          )}

          {mode === 'edit' && (
            <div>
              <TaskForm
                onSubmit={handleEditTask}
                initialData={getTaskFormData()}
                submitLabel="Salvesta muudatused"
                onCancel={() => setMode('view')}
              />
            </div>
          )}

          {mode === 'confirm-delete' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-900 mb-2">
                  Kas olete kindel, et soovite kustutada ülesande <strong>"{task.name}"</strong>?
                </p>
                <p className="text-red-600 text-sm">
                  Seda toimingut ei saa tagasi võtta.
                </p>
              </div>

              <div className="flex space-x-3 justify-center pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setMode('view')}
                  disabled={isLoading}
                >
                  Tühista
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteTask}
                  disabled={isLoading}
                >
                  {isLoading ? 'Kustutan...' : 'Jah, kustuta'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};
