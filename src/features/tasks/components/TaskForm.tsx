import React, { useState } from 'react';
import type { Task, TaskFormData } from '../../../types';
import { parseEstonianDate } from '../../../utils/dateUtils';
import { getTaskColor, VALIDATION_MESSAGES } from '../../../utils/constants';
import { useTaskValidation } from '../hooks/useTaskValidation';
import { Button, Input, ErrorDisplay } from '../../../components';
import type { TaskFormProps, TaskValidationErrors } from '../types/tasks.types';

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialData = { name: '', startDateStr: '', endDateStr: '' },
  submitLabel = 'Add Task',
  onCancel
}) => {
  const [formData, setFormData] = useState<TaskFormData>(initialData);
  const [errors, setErrors] = useState<TaskValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { validateEstonianDate } = useTaskValidation();

  // Local validation function for form-specific validation
  const validateForm = (data: TaskFormData): TaskValidationErrors => {
    const newErrors: TaskValidationErrors = {};

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
      setErrors((prev: TaskValidationErrors) => ({ ...prev, [field]: undefined }));
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
        <ErrorDisplay 
          errors={[{ field: 'general', message: errors.general }]} 
          language="et"
        />
      )}

      <div className="form-fields">
        {/* Task Name Field */}
        <Input
          id="taskName"
          label="Ülesande nimi"
          value={formData.name}
          onChange={handleInputChange('name')}
          placeholder="Sisestage ülesande nimi"
          error={errors.name}
          disabled={isSubmitting}
          maxLength={100}
          autoComplete="off"
        />

        {/* Start Date Field */}
        <Input
          id="startDate"
          label="Alguskuupäev"
          value={formData.startDateStr}
          onChange={handleInputChange('startDateStr')}
          placeholder="PP.KK.AAAA"
          error={errors.startDateStr}
          disabled={isSubmitting}
          pattern="\d{2}\.\d{2}\.\d{4}"
          autoComplete="off"
          helperText="Kuupäev formaadis PP.KK.AAAA"
        />

        {/* End Date Field */}
        <Input
          id="endDate"
          label="Lõppkuupäev"
          value={formData.endDateStr}
          onChange={handleInputChange('endDateStr')}
          placeholder="PP.KK.AAAA"
          error={errors.endDateStr}
          disabled={isSubmitting}
          pattern="\d{2}\.\d{2}\.\d{4}"
          autoComplete="off"
          helperText="Kuupäev formaadis PP.KK.AAAA"
        />
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            disabled={isSubmitting}
          >
            Tühista
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvestamine...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};