import type { Task, TaskFormData } from '../../../types';

/**
 * Unified validation errors interface for task operations
 */
export interface TaskValidationErrors {
  name?: string;
  startDate?: string;
  endDate?: string;
  startDateStr?: string;
  endDateStr?: string;
  general?: string;
}

/**
 * Modal mode for task details modal
 */
export type ModalMode = 'view' | 'edit' | 'confirm-delete';

/**
 * Props for TaskDetailsModal component
 */
export interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (taskId: string, updatedTask: Omit<Task, 'id'>) => Promise<{ success: boolean; errors?: Record<string, string> }>;
  onDelete?: (taskId: string) => Promise<{ success: boolean; error?: string }>;
  readOnly?: boolean;
}

/**
 * Props for TaskForm component
 */
export interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  initialData?: TaskFormData;
  submitLabel?: string;
  onCancel?: () => void;
}

/**
 * Return type for useTasks hook operations
 */
export interface TaskOperationResult {
  success: boolean;
  task?: Task;
  errors?: TaskValidationErrors;
  error?: string;
}

/**
 * Hook options for task management
 */
export interface UseTasksOptions {
  initialTasks?: Task[];
  autoValidate?: boolean;
}
