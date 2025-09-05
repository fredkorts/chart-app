/**
 * GanttChart Component
 * 
 * A quarterly Gantt chart visualization for displaying and managing tasks across a timeline.
 * This component provides an interactive quarterly view of tasks with the following features:
 * 
 * Core Functionality:
 * - Displays tasks as horizontal bars positioned by their start/end dates
 * - Shows a quarterly timeline (3 months at a time) with Estonian month names
 * - Handles quarter navigation (Previous/Next) with automatic year transitions
 * - Filters tasks to show only those that overlap with the current quarter
 * 
 * Visual Features:
 * - Task overlap handling: overlapping tasks are automatically arranged in separate rows
 * - Partial task indicators: shows when tasks extend beyond the current quarter view
 * - Continuation arrows: visual indicators for tasks that continue left/right of quarter
 * - Interactive hover states and click handling for task selection
 * - Empty state display when no tasks exist for the current quarter
 * 
 * Layout Structure:
 * - Header: Quarter navigation and month labels
 * - Content: Two-column layout with task names on left, timeline visualization on right
 * - Task bars: Positioned as percentages of quarter duration, with minimum 1% width
 * 
 * Data Processing Logic:
 * 1. Filters tasks that overlap with current quarter using existing date utilities
 * 2. Calculates task bar positions as percentages of quarter timeline
 * 3. Handles overlapping tasks by assigning them to different visual rows
 * 4. Clamps task display dates to quarter boundaries while preserving continuation indicators
 * 
 * Integration:
 * - Uses existing Task type and date utilities from the project
 * - Leverages Estonian localization constants for month names
 * - Follows established project patterns for component structure and styling
 */

import React, { useCallback, useState } from 'react';
import '../gantt.css';
import type { Task } from '../../../types';
import { QuarterNavigation } from './QuarterNavigation';
import { Timeline } from './Timeline';
import { useGanttCalculations } from '../hooks/useGanttCalculations';
import { TaskForm } from '@/features/tasks';
import { Button } from 'antd';

interface GanttChartProps {
  tasks: Task[];
  currentYear?: number;
  currentQuarter?: number;
  onTaskClick?: (task: Task) => void;
  onQuarterChange?: (year: number, quarter: number) => void;
  onAddTask?: (task: Omit<Task, 'id'>) => Promise<void> | void;
  className?: string;
}

const HEADER_HEIGHT = 60;

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  currentYear = new Date().getFullYear(),
  currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3),
  onTaskClick,
  onQuarterChange,
  onAddTask,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'quarter' | 'year'>('quarter');
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Use the extracted hook for all calculations
  const {
    timelineData,
    quarterTasks,
    taskBars,
    chartHeight,
    rowHeight,
    taskHeight
  } = useGanttCalculations({
    tasks,
    currentYear,
    currentQuarter: currentQuarter as 1 | 2 | 3 | 4,
    viewMode
  });

  // Handle quarter navigation
  const handleQuarterChange = useCallback((year: number, quarter: 1 | 2 | 3 | 4) => {
    onQuarterChange?.(year, quarter);
  }, [onQuarterChange]);

  // Handle task click
  const handleTaskClick = useCallback((task: Task, event: React.MouseEvent) => {
    event.stopPropagation();
    onTaskClick?.(task);
  }, [onTaskClick]);

  const handleAddTask = useCallback(async (task: Omit<Task, 'id'>) => {
    await onAddTask?.(task);
    setShowTaskForm(false);
  }, [onAddTask]);

  return (
    <div className={`gantt-chart ${className}`}>
      {/* Header with extracted navigation */}
      <div className="gantt-header">
        <div className="gantt-toolbar">
          <QuarterNavigation
            currentYear={currentYear}
            currentQuarter={currentQuarter as 1 | 2 | 3 | 4}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onQuarterChange={handleQuarterChange}
            disabled={showTaskForm}
          />
          <Button htmlType="button" onClick={() => setShowTaskForm(prev => !prev)}>
            {showTaskForm ? 'View Chart' : 'Add Task'}
          </Button>
        </div>

        {/* Timeline months header */}
        <div className="timeline-header">
          <div className="task-names-column">
            <div className="column-header">Tasks</div>
          </div>
          <div className="timeline-months">
            {timelineData.months.map((month) => (
              <div
                key={month.name}
                className="month-header"
                style={{ width: `${100 / timelineData.months.length}%` }}
              >
                <span className="month-name">{month.name}</span>
                <span className="month-year">{currentYear}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart content */}
      <div className="gantt-content" style={{ height: chartHeight - HEADER_HEIGHT }}>
        {showTaskForm ? (
          <div className="gantt-body task-form-view">
            <TaskForm onSubmit={handleAddTask} onCancel={() => setShowTaskForm(false)} />
          </div>
        ) : quarterTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            {viewMode === 'quarter' ? (
              <h3>No tasks for Q{currentQuarter} {currentYear}</h3>
            ) : (
              <h3>No tasks for {currentYear}</h3>
            )}
            <p>Add some tasks to see them in the timeline.</p>
          </div>
        ) : (
          <div className="gantt-body">
            {/* Task names column */}
            <div className="task-names-column">
              {taskBars.map((taskBar) => (
                <div key={taskBar.id} className="task-name-row"
                     style={{ top: taskBar.row * rowHeight, height: taskHeight }}>
                  <div className="task-name-label">
                    <span className="task-name-text" title={taskBar.name}>
                      {taskBar.name}
                    </span>
                    {taskBar.isPartial && (
                      <span className="partial-indicator" title="Task spans multiple quarters">*</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Extracted Timeline component */}
            <Timeline
              timelineData={timelineData}
              tasks={taskBars}
              rowHeight={rowHeight}
              taskHeight={taskHeight}
              onTaskClick={handleTaskClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Basic test component - using new modular approach
export const GanttChartTest = () => {
  const sampleTasks: Task[] = [
    {
      id: '1',
      name: 'Design Phase',
      startDate: new Date(2023, 0, 15),
      endDate: new Date(2023, 1, 28),
      color: '#3B82F6'
    },
    {
      id: '2', 
      name: 'Development',
      startDate: new Date(2023, 1, 1),
      endDate: new Date(2023, 2, 15),
      color: '#10B981'
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h3>Gantt Chart Test</h3>
      <GanttChart 
        tasks={sampleTasks}
        currentYear={2023}
        currentQuarter={1}
        onTaskClick={(task) => console.log('Task clicked:', task)}
      />
    </div>
  );
};
