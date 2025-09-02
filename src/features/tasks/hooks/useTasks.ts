import { useState, useCallback, useMemo } from 'react';
import type { Task } from '../../../types';
import { generateTaskId } from '../../../utils/dateUtils';
import { getTaskColor, VALIDATION_MESSAGES } from '../../../utils/constants';
import { useTaskValidation } from './useTaskValidation';
import type { TaskOperationResult, UseTasksOptions } from '../types/tasks.types';

export const useTasks = (options: UseTasksOptions = {}) => {
  const { initialTasks = [], autoValidate = true } = options;
  
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { validateTask, getFormErrors } = useTaskValidation();

  // Computed values
  const taskCount = useMemo(() => tasks.length, [tasks]);
  const hasActiveTasks = useMemo(() => {
    const now = new Date();
    return tasks.some(task => task.startDate <= now && task.endDate >= now);
  }, [tasks]);

  const addTask = useCallback(async (
    taskData: Omit<Task, 'id'>
  ): Promise<TaskOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate task data if autoValidate is enabled
      if (autoValidate) {
        const isValid = validateTask(taskData);
        
        if (!isValid) {
          return { 
            success: false, 
            errors: getFormErrors()
          };
        }
      }

      // Create new task
      const newTask: Task = {
        id: generateTaskId(),
        name: taskData.name,
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        color: taskData.color || getTaskColor()
      };

      setTasks(prev => [...prev, newTask]);
      return { success: true, task: newTask };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : VALIDATION_MESSAGES.SAVE_TASK_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [validateTask, getFormErrors, autoValidate]);

  const updateTask = useCallback(async (
    taskId: string, 
    updateData: Partial<Omit<Task, 'id'>>
  ): Promise<TaskOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const existingTask = tasks.find(task => task.id === taskId);
      
      if (!existingTask) {
        return { 
          success: false, 
          error: 'Task not found' 
        };
      }

      const updatedTask: Task = {
        ...existingTask,
        ...updateData
      };

      // Validate updated task if autoValidate is enabled
      if (autoValidate) {
        const isValid = validateTask(updatedTask);
        
        if (!isValid) {
          return { 
            success: false, 
            errors: getFormErrors()
          };
        }
      }

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );

      return { success: true, task: updatedTask };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : VALIDATION_MESSAGES.SAVE_TASK_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [tasks, validateTask, getFormErrors, autoValidate]);

  const deleteTask = useCallback(async (taskId: string): Promise<TaskOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const taskExists = tasks.some(task => task.id === taskId);
      
      if (!taskExists) {
        return { 
          success: false, 
          error: 'Task not found' 
        };
      }

      setTasks(prev => prev.filter(task => task.id !== taskId));
      return { success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [tasks]);

  const getTaskById = useCallback((taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  const getTasksByDateRange = useCallback((startDate: Date, endDate: Date): Task[] => {
    return tasks.filter(task => 
      task.startDate <= endDate && task.endDate >= startDate
    );
  }, [tasks]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  return {
    // State
    tasks,
    taskCount,
    hasActiveTasks,
    isLoading,
    error,
    
    // Operations
    addTask,
    updateTask,
    deleteTask,
    
    // Queries
    getTaskById,
    getTasksByDateRange,
    
    // Utilities
    clearError,
    clearAllTasks
  };
};