import { useState, useCallback, useMemo } from 'react';
import type { Task } from '../../../types';
import { generateTaskId } from '../../../utils/dateUtils';
import { getTaskColor, VALIDATION_MESSAGES } from '../../../utils/constants';
import { useTaskValidation } from './useTaskValidation';

// Local validation errors interface for the addTask function
interface ValidationErrors {
  name?: string;
  startDate?: string;
  endDate?: string;
  general?: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { validateTask } = useTaskValidation();

  // Computed values
  const taskCount = useMemo(() => tasks.length, [tasks]);
  const hasActiveTasks = useMemo(() => {
    const now = new Date();
    return tasks.some(task => task.startDate <= now && task.endDate >= now);
  }, [tasks]);

  const addTask = useCallback(async (
    taskData: Omit<Task, 'id'>
  ): Promise<{ success: boolean; task?: Task; errors?: ValidationErrors }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate task data
      const isValid = validateTask(taskData);
      
      if (!isValid) {
        return { 
          success: false, 
          errors: { general: VALIDATION_MESSAGES.SAVE_TASK_FAILED }
        };
      }

      // Create new task
      const newTask: Task = {
        ...taskData,
        id: generateTaskId(),
        name: taskData.name.trim(),
        // Ensure color is set
        color: taskData.color || getTaskColor()
      };

      // Add to tasks array
      setTasks(prevTasks => [...prevTasks, newTask]);

      return { success: true, task: newTask };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : VALIDATION_MESSAGES.SAVE_TASK_FAILED;
      setError(errorMessage);
      return { success: false, errors: { general: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  }, [validateTask]);

  

  const deleteTask = useCallback(async (taskId: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const taskExists = tasks.some(task => task.id === taskId);
      
      if (!taskExists) {
        return { success: false, error: VALIDATION_MESSAGES.TASK_NOT_FOUND };
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      return { success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : VALIDATION_MESSAGES.DELETE_TASK_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [tasks]);

  const updateTask = useCallback(async (
    taskId: string, 
    updateData: Partial<Omit<Task, 'id'>>
  ): Promise<{ success: boolean; task?: Task; errors?: ValidationErrors }> => {
    setIsLoading(true);
    setError(null);

    try {
      const existingTask = tasks.find(task => task.id === taskId);
      
      if (!existingTask) {
        return { success: false, errors: { general: VALIDATION_MESSAGES.TASK_NOT_FOUND } };
      }

      // Merge existing task with updates
      const updatedTaskData = { ...existingTask, ...updateData };
      
      // Validate updated task
      const isValid = validateTask(updatedTaskData);
      
      if (!isValid) {
        return { 
          success: false, 
          errors: { general: VALIDATION_MESSAGES.SAVE_TASK_FAILED }
        };
      }

      // Update task in array
      const updatedTask: Task = {
        ...updatedTaskData,
        id: taskId,
        name: updatedTaskData.name.trim()
      };

      setTasks(prevTasks =>
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );

      return { success: true, task: updatedTask };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : VALIDATION_MESSAGES.SAVE_TASK_FAILED;
      setError(errorMessage);
      return { success: false, errors: { general: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  }, [tasks, validateTask]);

  const getTask = useCallback((taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  // Get tasks for a specific quarter
  const getTasksForQuarter = useCallback((year: number, quarter: number): Task[] => {
    const quarterStart = new Date(year, (quarter - 1) * 3, 1);
    const quarterEnd = new Date(year, quarter * 3, 0);

    return tasks.filter(task => {
      // Task overlaps with quarter if it starts before quarter ends and ends after quarter starts
      return task.startDate <= quarterEnd && task.endDate >= quarterStart;
    });
  }, [tasks]);

  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    tasks,
    isLoading,
    error,
    
    // Computed values
    taskCount,
    hasActiveTasks,
    
    // Actions
    addTask,
    updateTask,
    deleteTask,
    getTask,
    getTasksForQuarter,
    clearTasks,
    
    // Utility
    clearError
  };
};
