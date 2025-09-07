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
