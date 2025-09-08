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
import { TaskPanel } from './TaskPanel.tsx';
import { useGanttCalculations } from '../hooks/useGanttCalculations';
import { Button } from 'antd';
import { DeleteConfirmation } from '../../../components';
import {
  GANTT_ACTIONS,
  GANTT_EMPTY_STATE,
  GANTT_CONFIRMATIONS,
  formatEmptyStateMessage
} from '../constants';

interface GanttChartProps {
  tasks: Task[];
  currentYear?: number;
  currentQuarter?: number;
  onQuarterChange: (year: number, quarter: 1 | 2 | 3 | 4) => void;
  onAddTask?: (task: Omit<Task, 'id'>) => Promise<void> | void;
  onEditTask?: (
    taskId: string,
    updatedTask: Omit<Task, 'id'>
  ) => Promise<{ success: boolean; task?: Task }> | void;
  onDeleteTask?: (taskId: string) => Promise<{ success: boolean } | void> | void;
  className?: string;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  currentYear = new Date().getFullYear(),
  currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3),
  onQuarterChange,
  onAddTask,
  onEditTask,
  onDeleteTask,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'quarter' | 'year'>('quarter');
  const [panelMode, setPanelMode] = useState<'chart' | 'add' | 'details' | 'edit' | 'confirm-delete'>('chart');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Use the extracted hook for all calculations
  const {
    timelineData,
    quarterTasks,
    taskBars,
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
    setSelectedTask(task);
    setPanelMode('details');
  }, []);

  const handleAddTask = useCallback(async (task: Omit<Task, 'id'>) => {
    await onAddTask?.(task);
    setPanelMode('chart');
  }, [onAddTask]);

  const handleEditSubmit = useCallback(async (updatedTask: Omit<Task, 'id'>) => {
    if (!selectedTask) return;
    const result = await onEditTask?.(selectedTask.id, updatedTask);
    if (result?.success && result.task) {
      setSelectedTask(result.task);
      setPanelMode('chart');
    }
  }, [onEditTask, selectedTask]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedTask) return;
    await onDeleteTask?.(selectedTask.id);
    setSelectedTask(null);
    setPanelMode('chart');
  }, [onDeleteTask, selectedTask]);

  const totalDays = (timelineData.endDate.getTime() - timelineData.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
  const now = new Date();

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
            disabled={panelMode !== 'chart'}
          />
          <Button
            htmlType="button"
            icon={panelMode === 'chart' ? '+' : '×'}
            onClick={() => {
              if (panelMode === 'chart') {
                setPanelMode('add');
              } else {
                setPanelMode('chart');
                setSelectedTask(null);
              }
            }}
          >
            {panelMode === 'chart' ? GANTT_ACTIONS.ADD_TASK : GANTT_ACTIONS.VIEW_CHART}
          </Button>
        </div>
      </div>

      {/* Chart content */}
      <div className={`gantt-content ${viewMode === 'year' ? 'year-view' : ''}`}>
        {/* Timeline months header */}
        <div className="timeline-header">
          <div className="timeline-months">
            {timelineData.months.map((month) => (
              <div
                key={month.name}
                className="month-header"
                style={{ width: `${100 / timelineData.months.length}%` }}
              >
                <span className="month-name">{month.name}</span>
              </div>
            ))}
          </div>

          <div className="timeline-weeks">
            {timelineData.weeks.map((week) => {
              const width = (week.days / totalDays) * 100;
              const isCurrent = now >= week.startDate && now <= week.endDate;
              return (
                <div
                  key={`week-${week.weekNumber}-${week.startDate.toISOString()}`}
                  data-testid={`week-${week.weekNumber}`}
                  className={`week-header${isCurrent ? ' current-week current' : ''}`}
                  style={{ width: `${width}%` }}
                >
                  <span className="week-number">{week.weekNumber}</span>
                </div>
              );
            })}
          </div>
        </div>

        {panelMode === 'confirm-delete' ? (
          <div className="gantt-body task-delete-confirm">
            <DeleteConfirmation
              message={GANTT_CONFIRMATIONS.DELETE_TASK_QUESTION}
              onConfirm={handleDeleteConfirm}
              onCancel={() => {
                setSelectedTask(null);
                setPanelMode('chart');
              }}
              confirmLabel={GANTT_ACTIONS.YES}
              cancelLabel={GANTT_ACTIONS.NO}
            />
          </div>
        ) : panelMode !== 'chart' ? (
          <TaskPanel
            mode={panelMode as 'add' | 'details' | 'edit'}
            task={selectedTask}
            onAdd={handleAddTask}
            onEdit={handleEditSubmit}
            onCancel={panelMode === 'add' ? () => setPanelMode('chart') : undefined}
            onCancelEdit={panelMode === 'edit' ? () => setPanelMode('details') : undefined}
            onBack={() => {
              setSelectedTask(null);
              setPanelMode('chart');
            }}
            onEditClick={() => setPanelMode('edit')}
            onDeleteClick={() => setPanelMode('confirm-delete')}
          />
        ) : quarterTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{GANTT_EMPTY_STATE.EMPTY_ICON}</div>
            <h3>{formatEmptyStateMessage(currentYear, currentQuarter, viewMode)}</h3>
            <p>{GANTT_EMPTY_STATE.ADD_TASKS_PROMPT}</p>
          </div>
        ) : (
          <div className="gantt-body">

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