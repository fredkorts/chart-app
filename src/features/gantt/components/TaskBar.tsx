/**
 * TaskBar Component
 * 
 * A specialized component for rendering individual task bars within the Gantt chart timeline.
 * This component will be extracted from the GanttChart to provide focused, reusable 
 * task visualization with enhanced interactivity and visual features.
 * 
 * Core Responsibilities:
 * - Render a single task as a horizontal bar with appropriate positioning and sizing
 * - Display task name, duration, and visual indicators within the bar
 * - Handle task-specific interactions (click, hover, drag for future resizing)
 * - Show continuation indicators for tasks extending beyond current view
 * - Display partial task indicators and overflow handling
 * 
 * Visual Features:
 * - Dynamic background color based on task.color property
 * - Hover states with enhanced visibility and tooltips
 * - Focus states for keyboard navigation accessibility
 * - Continuation arrows (◄ ►) for tasks extending beyond quarter boundaries
 * - Partial task asterisk (*) indicator for multi-quarter tasks
 * - Responsive text sizing based on bar width
 * - Progress indicators (future enhancement)
 * 
 * Props Interface (planned):
 * - task: Task - The task data to render
 * - position: { left: number, width: number, top: number } - Bar positioning
 * - isPartial: boolean - Whether task extends beyond current view
 * - continuesLeft: boolean - Task continues before current period
 * - continuesRight: boolean - Task continues after current period
 * - isHovered: boolean - Current hover state
 * - isSelected: boolean - Current selection state
 * - onClick: (task: Task, event: MouseEvent) => void - Click handler
 * - onHover: (task: Task | null) => void - Hover state handler
 * - onDoubleClick?: (task: Task) => void - Edit trigger
 * - className?: string - Additional CSS classes
 * 
 * Interaction Features:
 * - Single click for selection/details
 * - Double click for editing (future)
 * - Hover for preview information
 * - Keyboard navigation support
 * - Drag handles for resizing (future enhancement)
 * - Context menu support (future enhancement)
 * 
 * Data Display Logic:
 * - Intelligent text truncation based on available space
 * - Tooltip showing full task details on hover
 * - Date range display in tooltip (start - end dates)
 * - Duration calculation and display
 * - Task status indicators (future enhancement)
 * 
 * Accessibility Features:
 * - ARIA labels for screen readers
 * - Keyboard navigation support (Tab, Enter, Space)
 * - High contrast mode compatibility
 * - Focus management for nested interactions
 * - Semantic HTML structure
 * 
 * Performance Considerations:
 * - Memoization to prevent unnecessary re-renders
 * - Efficient event handling with useCallback
 * - Optimized positioning calculations
 * - Lazy loading for large task sets (future)
 * 
 * Integration Points:
 * - Uses Task type from types/index.ts
 * - Integrates with existing color scheme from constants.ts
 * - Compatible with GanttChart layout calculations
 * - Reusable in other timeline components
 * - Works with task management hooks from features/tasks
 */

import React from 'react';
import type { Task } from '../../../types';

export interface TaskBarData extends Task {
  left: number; // percentage
  width: number; // percentage
  row: number;
  isPartial: boolean;
  continuesLeft: boolean;
  continuesRight: boolean;
}

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
export const TaskBar: React.FC<TaskBarProps> = ({
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
      {task.continuesLeft && <div className="continuation-left">◄</div>}
      {task.continuesRight && <div className="continuation-right">►</div>}
      <div className="task-bar-content">
        <span className="task-bar-name">{task.name}</span>
      </div>
    </div>
  );
};

export default TaskBar;

