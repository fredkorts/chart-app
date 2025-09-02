import { useState } from 'react';
import type { Task, ValidationError, TaskFormData } from '@/types';
import { VALIDATION_MESSAGES } from '@/utils/constants';
import { parseEstonianDate } from '@/utils/dateUtils';
import type { TaskValidationErrors } from '../types/tasks.types';

export const useTaskValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  
  const validateTask = (task: Partial<Task>) => {
    const foundErrors: ValidationError[] = [];
    if (!task.name?.trim()) {
      foundErrors.push({ field: 'name', message: VALIDATION_MESSAGES.TASK_NAME_REQUIRED });
    }
    if (!task.startDate) {
      foundErrors.push({ field: 'startDate', message: VALIDATION_MESSAGES.START_DATE_REQUIRED });
    }
    if (!task.endDate) {
      foundErrors.push({ field: 'endDate', message: VALIDATION_MESSAGES.END_DATE_REQUIRED });
    }
    if (task.startDate && task.endDate && task.startDate > task.endDate) {
      foundErrors.push({ field: 'endDate', message: VALIDATION_MESSAGES.END_DATE_BEFORE_START });
    }
    
    setErrors(foundErrors);
    return foundErrors.length === 0;
  };

  // Convert ValidationError[] to TaskValidationErrors format for form use
  const getFormErrors = (): TaskValidationErrors => {
    const formErrors: TaskValidationErrors = {};
    errors.forEach(error => {
      formErrors[error.field as keyof TaskValidationErrors] = error.message;
    });
    return formErrors;
  };

  // Validate Estonian date string format
  const validateEstonianDate = (dateStr: string): boolean => {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!regex.test(dateStr)) return false;
    
    const [day, month, year] = dateStr.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };
  
  const clearErrors = () => setErrors([]);

  const validateTaskForm = (data: TaskFormData): TaskValidationErrors => {
    const formErrors: TaskValidationErrors = {};

    if (!data.name.trim()) {
      formErrors.name = VALIDATION_MESSAGES.TASK_NAME_REQUIRED;
    } else if (data.name.trim().length < 2) {
      formErrors.name = VALIDATION_MESSAGES.TASK_NAME_TOO_SHORT;
    } else if (data.name.trim().length > 100) {
      formErrors.name = VALIDATION_MESSAGES.TASK_NAME_TOO_LONG;
    }

    if (!data.startDateStr.trim()) {
      formErrors.startDateStr = VALIDATION_MESSAGES.START_DATE_REQUIRED;
    } else if (!validateEstonianDate(data.startDateStr)) {
      formErrors.startDateStr = VALIDATION_MESSAGES.INVALID_DATE_FORMAT;
    }

    if (!data.endDateStr.trim()) {
      formErrors.endDateStr = VALIDATION_MESSAGES.END_DATE_REQUIRED;
    } else if (!validateEstonianDate(data.endDateStr)) {
      formErrors.endDateStr = VALIDATION_MESSAGES.INVALID_DATE_FORMAT;
    }

    if (validateEstonianDate(data.startDateStr) && validateEstonianDate(data.endDateStr)) {
      const startDate = parseEstonianDate(data.startDateStr);
      const endDate = parseEstonianDate(data.endDateStr);

      if (startDate && endDate && endDate <= startDate) {
        formErrors.endDateStr = VALIDATION_MESSAGES.END_DATE_BEFORE_START;
      }

      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const twoYearsFromNow = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());

      if (startDate && startDate < oneYearAgo) {
        formErrors.startDateStr = VALIDATION_MESSAGES.START_DATE_TOO_OLD;
      }
      if (endDate && endDate > twoYearsFromNow) {
        formErrors.endDateStr = VALIDATION_MESSAGES.END_DATE_TOO_FAR;
      }
    }

    return formErrors;
  };

  return {
    errors,
    validateTask,
    getFormErrors,
    validateEstonianDate,
    clearErrors,
    validateTaskForm,
  };
};