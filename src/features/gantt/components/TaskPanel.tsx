import React from 'react';
import type { Task } from '../../../types';
import { TaskForm, DetailsView } from '../../tasks';
import { formatDate } from '../../../utils/dateUtils';
import { GANTT_ACTIONS } from '../constants';

interface TaskPanelProps {
  mode: 'add' | 'edit' | 'details';
  task: Task | null;
  onAdd?: (task: Omit<Task, 'id'>) => Promise<void> | void;
  onEdit?: (task: Omit<Task, 'id'>) => Promise<void> | void;
  onCancel?: () => void; // Used for add form cancel
  onCancelEdit?: () => void; // Used for edit form cancel
  onBack?: () => void; // Used for details back to chart
  onEditClick?: () => void; // Used for details edit button
  onDeleteClick?: () => void; // Used for details delete button
}

const getTaskFormData = (task: Task) => ({
  name: task.name,
  startDateStr: formatDate(task.startDate),
  endDateStr: formatDate(task.endDate)
});

export const TaskPanel: React.FC<TaskPanelProps> = ({
  mode,
  task,
  onAdd,
  onEdit,
  onCancel,
  onCancelEdit,
  onBack,
  onEditClick,
  onDeleteClick
}) => {
  if (mode === 'add') {
    return (
      <div className="gantt-body task-form-view">
        <TaskForm
          onSubmit={onAdd!}
          onCancel={onCancel}
          submitLabel={GANTT_ACTIONS.ADD_TASK}
        />
      </div>
    );
  }

  if (mode === 'edit' && task) {
    return (
      <div className="gantt-body task-form-view">
        <TaskForm
          onSubmit={onEdit!}
          onCancel={onCancelEdit}
          submitLabel={GANTT_ACTIONS.SAVE_CHANGES}
          initialData={getTaskFormData(task)}
        />
      </div>
    );
  }

  if (mode === 'details' && task) {
    return (
      <DetailsView
        task={task}
        onEdit={onEditClick!}
        onBack={onBack!}
        onDelete={onDeleteClick!}
      />
    );
  }

  return null;
};
