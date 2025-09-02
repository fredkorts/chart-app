import { useState } from "react";
import type { Task, ValidationError } from "../../../types";
import { VALIDATION_MESSAGES } from "../../../utils/constants";
import type { TaskValidationErrors } from "../types/tasks.types";

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
  
  return { 
    errors, 
    validateTask, 
    getFormErrors, 
    validateEstonianDate, 
    clearErrors 
  };
};