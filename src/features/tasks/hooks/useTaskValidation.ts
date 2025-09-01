import { useState } from "react";
import type { Task, ValidationError } from "../../../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useTaskValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  
  const validateTask = (task: Partial<Task>) => {
    const foundErrors = [];
    if (!task.name?.trim()) {
      foundErrors.push({ field: 'name', message: 'Task name is required' });
    }
    if (!task.startDate) {
      foundErrors.push({ field: 'startDate', message: 'Start date is required' });
    }
    if (!task.endDate) {
      foundErrors.push({ field: 'endDate', message: 'End date is required' });
    }
    if (task.startDate && task.endDate && task.startDate > task.endDate) {
      foundErrors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
    
    setErrors(foundErrors);
    return foundErrors.length === 0;
  };
  
  const clearErrors = () => setErrors([]);
  
  return { errors, validateTask, clearErrors };
};