import React, { useCallback, useState } from 'react';
import '../gantt.css';
import type { Task } from '../../../types';
import { QuarterNavigation } from './QuarterNavigation';
import { Timeline } from './Timeline';
import { TaskPanel } from '../../tasks';
import { useGanttCalculations } from '../hooks/useGanttCalculations';
import { DeleteConfirmation, ToggleViewButton } from '../../../components';
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
          <ToggleViewButton
            panelMode={panelMode}
            onToggle={() => {
              if (panelMode === 'chart') {
                setPanelMode('add');
              } else {
                setPanelMode('chart');
                setSelectedTask(null);
              }
            }}
            className="desktop"
          />
        </div>
      </div>

      {/* Chart content */}
      <div className={`gantt-content ${viewMode === 'year' ? 'year-view' : ''}`}>
        <ToggleViewButton
          panelMode={panelMode}
          onToggle={() => {
            if (panelMode === 'chart') {
              setPanelMode('add');
            } else {
              setPanelMode('chart');
              setSelectedTask(null);
            }
          }}
          className="mobile"
        />
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