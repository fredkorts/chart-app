import React, { useState } from 'react';
import type { Task, TaskFormData } from '@/types';
import '../tasks.css';
import { parseEstonianDate } from '@/utils/dateUtils';
import { getTaskColor, VALIDATION_MESSAGES } from '@/utils/constants';
import { useTaskValidation } from '../hooks/useTaskValidation';
import { ErrorDisplay } from '@/components';
import { DatePicker, Button, Input, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { TaskFormProps, TaskValidationErrors } from '../types/tasks.types';

dayjs.extend(customParseFormat);

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialData = { name: '', startDateStr: '', endDateStr: '' },
  submitLabel = 'Add Task',
  onCancel
}) => {
  const [formData, setFormData] = useState<TaskFormData>(initialData);
  const [errors, setErrors] = useState<TaskValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { validateTaskForm } = useTaskValidation();

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

  const handleDateRangeChange = (dates: null | [Dayjs | null, Dayjs | null]) => {
    if (dates && dates[0] && dates[1]) {
      const startStr = dates[0].format('DD.MM.YYYY');
      const endStr = dates[1].format('DD.MM.YYYY');
      setFormData(prev => ({ ...prev, startDateStr: startStr, endDateStr: endStr }));
      if (errors.startDateStr || errors.endDateStr) {
        setErrors(prev => ({ ...prev, startDateStr: undefined, endDateStr: undefined }));
      }
    } else {
      setFormData(prev => ({ ...prev, startDateStr: '', endDateStr: '' }));
    }
  };

  const now = dayjs();
  const minDate = now.subtract(1, 'year');
  const maxDate = now.add(2, 'year');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      const validationErrors = validateTaskForm(formData);
      
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
        />
      )}

      <div className="form-fields">
        {/* Task Name Field */}
        <div>
          <Input
            id="taskName"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="Sisestage ülesande nimi"
            disabled={isSubmitting}
            maxLength={100}
            autoComplete="off"
            style={{ width: '100%' }}
          />
          {errors.name && (
            <Typography.Text type="danger" style={{ display: 'block', marginTop: 4 }}>
              {errors.name}
            </Typography.Text>
          )}
        </div>

        {/* Date Range Field */}
        <div>
          <DatePicker.RangePicker
            value={
              formData.startDateStr && formData.endDateStr
                ? [
                    dayjs(formData.startDateStr, 'DD.MM.YYYY'),
                    dayjs(formData.endDateStr, 'DD.MM.YYYY')
                  ]
                : null
            }
            onChange={handleDateRangeChange}
            format="DD.MM.YYYY"
            minDate={minDate}
            maxDate={maxDate}
            disabled={isSubmitting}
            style={{ width: '100%' }}
            placeholder={["Alguskuupäev", "Lõppkuupäev"]}
          />
          {(errors.startDateStr || errors.endDateStr) && (
            <Typography.Text type="danger" style={{ display: 'block', marginTop: 4 }}>
              {errors.startDateStr || errors.endDateStr}
            </Typography.Text>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        {onCancel && (
          <Button
            htmlType="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Tühista
          </Button>
        )}
        <Button
          htmlType="submit"
          type="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvestamine...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};