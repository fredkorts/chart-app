import React, { useState } from 'react';
import type { Task, TaskFormData } from '../../../types';
import { parseEstonianDate } from '../../../utils/dateUtils';
import { getTaskColor, VALIDATION_MESSAGES } from '../../../utils/constants';

// Local validation errors interface (using simple field names for form validation)
interface ValidationErrors {
  name?: string;
  startDateStr?: string;
  endDateStr?: string;
  general?: string;
}

// Props interface
interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  initialData?: TaskFormData;
  submitLabel?: string;
  onCancel?: () => void;
}

// Estonian date validation utility
const validateEstonianDate = (dateStr: string): boolean => {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!regex.test(dateStr)) return false;
  
  const [day, month, year] = dateStr.split('.').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
};

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialData = { name: '', startDateStr: '', endDateStr: '' },
  submitLabel = 'Add Task',
  onCancel
}) => {
  const [formData, setFormData] = useState<TaskFormData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateForm = (data: TaskFormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Task name validation
    if (!data.name.trim()) {
      newErrors.name = VALIDATION_MESSAGES.TASK_NAME_REQUIRED;
    } else if (data.name.trim().length < 2) {
      newErrors.name = VALIDATION_MESSAGES.TASK_NAME_TOO_SHORT;
    } else if (data.name.trim().length > 100) {
      newErrors.name = VALIDATION_MESSAGES.TASK_NAME_TOO_LONG;
    }

    // Start date validation
    if (!data.startDateStr.trim()) {
      newErrors.startDateStr = VALIDATION_MESSAGES.START_DATE_REQUIRED;
    } else if (!validateEstonianDate(data.startDateStr)) {
      newErrors.startDateStr = VALIDATION_MESSAGES.INVALID_DATE_FORMAT;
    }

    // End date validation
    if (!data.endDateStr.trim()) {
      newErrors.endDateStr = VALIDATION_MESSAGES.END_DATE_REQUIRED;
    } else if (!validateEstonianDate(data.endDateStr)) {
      newErrors.endDateStr = VALIDATION_MESSAGES.INVALID_DATE_FORMAT;
    }

    // Date range validation
    if (validateEstonianDate(data.startDateStr) && validateEstonianDate(data.endDateStr)) {
      const startDate = parseEstonianDate(data.startDateStr);
      const endDate = parseEstonianDate(data.endDateStr);
      
      if (startDate && endDate && endDate <= startDate) {
        newErrors.endDateStr = VALIDATION_MESSAGES.END_DATE_BEFORE_START;
      }

      // Check for reasonable date ranges (not too far in past/future)
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const twoYearsFromNow = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());

      if (startDate && startDate < oneYearAgo) {
        newErrors.startDateStr = VALIDATION_MESSAGES.START_DATE_TOO_OLD;
      }
      if (endDate && endDate > twoYearsFromNow) {
        newErrors.endDateStr = VALIDATION_MESSAGES.END_DATE_TOO_FAR;
      }
    }

    return newErrors;
  };

  // Handle input changes
  const handleInputChange = (field: keyof TaskFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      const validationErrors = validateForm(formData);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Create task object
      const task: Omit<Task, 'id'> = {
        name: formData.name.trim(),
        startDate: parseEstonianDate(formData.startDateStr)!,
        endDate: parseEstonianDate(formData.endDateStr)!,
        color: getTaskColor()
      };

      // Submit task
      await onSubmit(task);

      // Reset form on successful submission
      if (!initialData.name) { // Only reset if it's a new task form
        setFormData({ name: '', startDateStr: '', endDateStr: '' });
        setErrors({});
      }

    } catch (error) {
      setErrors({ general: VALIDATION_MESSAGES.SAVE_TASK_FAILED });
      console.error('Task submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {/* General error display */}
      {errors.general && (
        <div className="error-message general-error" role="alert">
          {errors.general}
        </div>
      )}

      <div className="form-fields">
        {/* Task Name Field */}
        <div className="field-group">
          <label htmlFor="taskName" className="field-label">
            Task Name
          </label>
          <input
            id="taskName"
            type="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="Enter task name"
            className={`field-input ${errors.name ? 'error' : ''}`}
            disabled={isSubmitting}
            maxLength={100}
            autoComplete="off"
          />
          {errors.name && (
            <div className="field-error" role="alert">
              {errors.name}
            </div>
          )}
        </div>

        {/* Start Date Field */}
        <div className="field-group">
          <label htmlFor="startDate" className="field-label">
            Start Date
          </label>
          <input
            id="startDate"
            type="text"
            value={formData.startDateStr}
            onChange={handleInputChange('startDateStr')}
            placeholder="DD.MM.YYYY"
            className={`field-input ${errors.startDateStr ? 'error' : ''}`}
            disabled={isSubmitting}
            pattern="\d{2}\.\d{2}\.\d{4}"
            autoComplete="off"
          />
          {errors.startDateStr && (
            <div className="field-error" role="alert">
              {errors.startDateStr}
            </div>
          )}
        </div>

        {/* End Date Field */}
        <div className="field-group">
          <label htmlFor="endDate" className="field-label">
            End Date
          </label>
          <input
            id="endDate"
            type="text"
            value={formData.endDateStr}
            onChange={handleInputChange('endDateStr')}
            placeholder="DD.MM.YYYY"
            className={`field-input ${errors.endDateStr ? 'error' : ''}`}
            disabled={isSubmitting}
            pattern="\d{2}\.\d{2}\.\d{4}"
            autoComplete="off"
          />
          {errors.endDateStr && (
            <div className="field-error" role="alert">
              {errors.endDateStr}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};