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
import { TaskForm, DetailsView } from '@/features/tasks';
import { Button } from 'antd';
import { formatDate } from '@/utils/dateUtils';

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

  const getTaskFormData = (task: Task) => ({
    name: task.name,
    startDateStr: formatDate(task.startDate),
    endDateStr: formatDate(task.endDate)
  });

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
            onClick={() => {
              if (panelMode === 'chart') {
                setPanelMode('add');
              } else {
                setPanelMode('chart');
                setSelectedTask(null);
              }
            }}
          >
            {panelMode === 'chart' ? 'Lisa ülesanne' : 'Vaata graafikut'}
          </Button>
        </div>

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
        </div>
      </div>

      {/* Chart content */}
      <div className="gantt-content">
        {panelMode === 'add' ? (
          <div className="gantt-body task-form-view">
            <TaskForm onSubmit={handleAddTask} onCancel={() => setPanelMode('chart')} />
          </div>
        ) : panelMode === 'edit' && selectedTask ? (
          <div className="gantt-body task-form-view">
            <TaskForm
              onSubmit={handleEditSubmit}
              onCancel={() => setPanelMode('details')}
              submitLabel="Salvesta muudatused"
              initialData={getTaskFormData(selectedTask)}
            />
          </div>
        ) : panelMode === 'details' && selectedTask ? (
          <DetailsView
            task={selectedTask}
            onEdit={() => setPanelMode('edit')}
            onBack={() => {
              setSelectedTask(null);
              setPanelMode('chart');
            }}
            onDelete={() => setPanelMode('confirm-delete')}
          />
        ) : panelMode === 'confirm-delete' && selectedTask ? (
          <div className="gantt-body task-details-view">
            <div className="space-y-4">
              <p className="text-center">Kas soovite kustutada selle ülesande?</p>
              <div className="flex space-x-3 justify-center pt-4">
                <Button onClick={() => { setSelectedTask(null); setPanelMode('chart'); }}>
                  Ei
                </Button>
                <Button danger onClick={handleDeleteConfirm}>
                  Jah
                </Button>
              </div>
            </div>
          </div>
        ) : quarterTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            {viewMode === 'quarter' ? (
              <h3>Aasta {currentYear} Q{currentQuarter} puuduvad ülesanded</h3>
            ) : (
              <h3>Aastal {currentYear} puuduvad ülesanded</h3>
            )}
            <p>Lisa ülesandeid, et näha neid ajakavas.</p>
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
