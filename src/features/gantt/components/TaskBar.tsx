import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Task } from '@/types';
import type { TaskBarData } from '../types/gantt.types';

interface TaskBarProps {
  task: TaskBarData;
  rowHeight: number;
  taskHeight: number;
  isHovered?: boolean;
  onHover?: (taskId: string | null) => void;
  onClick?: (task: Task, event: React.MouseEvent) => void;
  className?: string;
}

/**
 * Render a single task bar within the Gantt timeline. This component is purely
 * presentational and relies on positioning data calculated elsewhere.
 */
const TaskBarComponent: React.FC<TaskBarProps> = ({
  task,
  rowHeight,
  taskHeight,
  isHovered = false,
  onHover,
  onClick,
  className = ''
}) => {
  const handleMouseEnter = () => onHover?.(task.id);
  const handleMouseLeave = () => onHover?.(null);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(task, e);
  };

  return (
    <div
      className={`task-bar ${isHovered ? 'hovered' : ''} ${task.isPartial ? 'partial' : ''} ${className}`}
      style={{
        left: `${task.left}%`,
        width: `${task.width}%`,
        top: task.row * rowHeight,
        height: taskHeight,
        backgroundColor: task.color
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      title={`${task.name}\n${task.startDate.toLocaleDateString()} - ${task.endDate.toLocaleDateString()}`}
    >
      {task.continuesLeft && <div className="continuation-left"><LeftOutlined style={{ fontSize: '12px', color: 'rgba(251, 251, 251, 1)' }} /></div>}
      {task.continuesRight && <div className="continuation-right"><RightOutlined style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 1)' }} /></div>}
      <div className="task-bar-content">
        <span className="task-bar-name">{task.name}</span>
      </div>
    </div>
  );
};

export const TaskBar = React.memo(TaskBarComponent);

export default TaskBar;

