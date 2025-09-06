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
import {
  formatDate,
  calculateDuration,
  formatDurationEstonian
} from '@/utils/dateUtils';
import { VALIDATION_MESSAGES } from '@/utils/constants';

interface GanttChartProps {
  tasks: Task[];
  currentYear?: number;
  currentQuarter?: number;
  onQuarterChange?: (year: number, quarter: number) => void;
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
      setPanelMode('details');
    }
  }, [onEditTask, selectedTask]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedTask) return;
    await onDeleteTask?.(selectedTask.id);
    setSelectedTask(null);
    setPanelMode('chart');
  }, [onDeleteTask, selectedTask]);

  const getTaskStatus = (
    startDate: Date,
    endDate: Date
  ): { status: string; className: string } => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (now < start) {
      return {
        status: VALIDATION_MESSAGES.STATUS_UPCOMING,
        className: 'status-upcoming'
      };
    } else if (now > end) {
      return {
        status: VALIDATION_MESSAGES.STATUS_COMPLETED,
        className: 'status-completed'
      };
    } else {
      return {
        status: VALIDATION_MESSAGES.STATUS_IN_PROGRESS,
        className: 'status-active'
      };
    }
  };

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
            {panelMode === 'chart' ? 'Add Task' : 'View Chart'}
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
          <div className="gantt-body task-details-view">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Ülesande nimi:</label>
                  <div className="text-gray-900 font-medium">{selectedTask.name}</div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Värv:</label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: selectedTask.color }}
                    />
                    <span className="text-gray-600 text-sm">{selectedTask.color}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Alguskuupäev:</label>
                  <div className="text-gray-900">{formatDate(selectedTask.startDate)}</div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Lõppkuupäev:</label>
                  <div className="text-gray-900">{formatDate(selectedTask.endDate)}</div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Kestus:</label>
                  <div className="text-gray-900">
                    {formatDurationEstonian(calculateDuration(selectedTask.startDate, selectedTask.endDate))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Staatus:</label>
                  <div className="text-gray-900">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTaskStatus(selectedTask.startDate, selectedTask.endDate).className}`}>
                      {getTaskStatus(selectedTask.startDate, selectedTask.endDate).status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Ülesande ID:</label>
                  <div className="text-gray-500 text-sm font-mono">{selectedTask.id}</div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Button type="primary" onClick={() => setPanelMode('edit')}>
                  Muuda
                </Button>
                <Button onClick={() => { setSelectedTask(null); setPanelMode('chart'); }}>
                  Mine tagasi
                </Button>
                <Button danger onClick={() => setPanelMode('confirm-delete')}>
                  Kustuta
                </Button>
              </div>
            </div>
          </div>
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
              <h3>No tasks for Q{currentQuarter} {currentYear}</h3>
            ) : (
              <h3>No tasks for {currentYear}</h3>
            )}
            <p>Add some tasks to see them in the timeline.</p>
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
      />
    </div>
  );
};
