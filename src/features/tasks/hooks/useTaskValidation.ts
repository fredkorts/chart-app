import { useState } from "react";
import type { Task, ValidationError } from "../../../types";
import { VALIDATION_MESSAGES } from "../../../utils/constants";

 
export const useTaskValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  
  const validateTask = (task: Partial<Task>) => {
    const foundErrors = [];
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
  
  const clearErrors = () => setErrors([]);
  
  return { errors, validateTask, clearErrors };
};