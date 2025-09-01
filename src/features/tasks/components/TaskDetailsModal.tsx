import React, { useState, useEffect } from 'react';
import type { Task } from '../../../types';
import { TaskForm } from './TaskForm';
import { formatDate, calculateDuration, formatDurationEstonian } from '../../../utils/dateUtils';
import { VALIDATION_MESSAGES } from '../../../utils/constants';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (taskId: string, updatedTask: Omit<Task, 'id'>) => Promise<{ success: boolean; errors?: Record<string, string> }>;
  onDelete?: (taskId: string) => Promise<{ success: boolean; error?: string }>;
  readOnly?: boolean;
}

type ModalMode = 'view' | 'edit' | 'confirm-delete';

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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

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
        // Let the form handle validation errors
        throw new Error(VALIDATION_MESSAGES.VALIDATION_FAILED);
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
        setError(result.error || VALIDATION_MESSAGES.DELETE_TASK_FAILED);
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

  // Render loading overlay
  const renderLoadingOverlay = () => (
    <div className="modal-loading-overlay">
      <div className="loading-spinner" />
      <span>Töötleb...</span>
    </div>
  );

  // Render view mode
  const renderViewMode = () => {
    if (!task) return null;

    const { status, className } = getTaskStatus(task.startDate, task.endDate);
    const duration = formatDurationEstonian(calculateDuration(task.startDate, task.endDate));

    return (
      <>
        <div className="modal-header">
          <h2 className="modal-title">Ülesande detailid</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Sulge modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* Task Name */}
          <div className="task-detail-row">
            <label className="detail-label">Ülesande nimi:</label>
            <div className="detail-value task-name">
              {task.name}
            </div>
          </div>

          {/* Task Color */}
          <div className="task-detail-row">
            <label className="detail-label">Värv:</label>
            <div className="detail-value">
              <div 
                className="color-indicator"
                style={{ backgroundColor: task.color }}
                aria-label={`Ülesande värv: ${task.color}`}
              />
              <span className="color-code">{task.color}</span>
            </div>
          </div>

          {/* Start Date */}
          <div className="task-detail-row">
            <label className="detail-label">Alguskuupäev:</label>
            <div className="detail-value">
              {formatDate(task.startDate)}
            </div>
          </div>

          {/* End Date */}
          <div className="task-detail-row">
            <label className="detail-label">Lõppkuupäev:</label>
            <div className="detail-value">
              {formatDate(task.endDate)}
            </div>
          </div>

          {/* Duration */}
          <div className="task-detail-row">
            <label className="detail-label">Kestus:</label>
            <div className="detail-value">
              {duration}
            </div>
          </div>

          {/* Status */}
          <div className="task-detail-row">
            <label className="detail-label">Staatus:</label>
            <div className="detail-value">
              <span className={`task-status ${className}`}>
                {status}
              </span>
            </div>
          </div>

          {/* Task ID (for debugging/reference) */}
          <div className="task-detail-row">
            <label className="detail-label">Ülesande ID:</label>
            <div className="detail-value task-id">
              {task.id}
            </div>
          </div>
        </div>

        {!readOnly && (
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setMode('edit')}
              disabled={isLoading}
            >
              Muuda
            </button>
            <button
              className="btn btn-danger"
              onClick={() => setMode('confirm-delete')}
              disabled={isLoading}
            >
              Kustuta
            </button>
          </div>
        )}
      </>
    );
  };

  // Render edit mode
  const renderEditMode = () => {
    if (!task) return null;

    return (
      <>
        <div className="modal-header">
          <h2 className="modal-title">Muuda ülesannet</h2>
          <button
            className="modal-close-btn"
            onClick={() => setMode('view')}
            disabled={isLoading}
            aria-label="Sulge modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <TaskForm
            onSubmit={handleEditTask}
            initialData={getTaskFormData()}
            submitLabel="Salvesta muudatused"
            onCancel={() => setMode('view')}
          />
        </div>
      </>
    );
  };

  // Render delete confirmation
  const renderDeleteConfirmation = () => {
    if (!task) return null;

    return (
      <>
        <div className="modal-header">
          <h2 className="modal-title">Kinnita kustutamine</h2>
          <button
            className="modal-close-btn"
            onClick={() => setMode('view')}
            disabled={isLoading}
            aria-label="Sulge modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <p className="delete-confirmation-text">
            Kas olete kindel, et soovite kustutada ülesande <strong>"{task.name}"</strong>?
          </p>
          <p className="delete-warning">
            Seda toimingut ei saa tagasi võtta.
          </p>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setMode('view')}
            disabled={isLoading}
          >
            Tühista
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDeleteTask}
            disabled={isLoading}
          >
            {isLoading ? 'Kustutan...' : 'Jah, kustuta'}
          </button>
        </div>
      </>
    );
  };

  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container task-details-modal">
        {isLoading && renderLoadingOverlay()}
        
        {mode === 'view' && renderViewMode()}
        {mode === 'edit' && renderEditMode()}
        {mode === 'confirm-delete' && renderDeleteConfirmation()}
      </div>
    </div>
  );
};
