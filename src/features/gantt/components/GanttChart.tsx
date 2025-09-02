import React, { useState, useMemo, useCallback } from 'react';
import type { Task } from '../../../types';
import { getQuarterStart, getQuarterEnd, isTaskInQuarter } from '../../../utils/dateUtils';
import { ESTONIAN_MONTHS } from '../../../utils/constants';

interface GanttChartProps {
  tasks: Task[];
  currentYear?: number;
  currentQuarter?: number;
  onTaskClick?: (task: Task) => void;
  onQuarterChange?: (year: number, quarter: number) => void;
  className?: string;
}

interface TimelineData {
  year: number;
  quarter: number;
  startDate: Date;
  endDate: Date;
  months: Array<{
    name: string;
    date: Date;
    daysInMonth: number;
  }>;
}

interface TaskBarData extends Task {
  left: number;
  width: number;
  row: number;
  isPartial: boolean;
  continuesLeft: boolean;
  continuesRight: boolean;
}

const TASK_HEIGHT = 28;
const TASK_GAP = 4;
const ROW_HEIGHT = TASK_HEIGHT + TASK_GAP;
const HEADER_HEIGHT = 60;

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  currentYear = new Date().getFullYear(),
  currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3),
  onTaskClick,
  onQuarterChange,
  className = ''
}) => {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  // Calculate timeline data for current quarter
  const timelineData = useMemo((): TimelineData => {
    const startDate = getQuarterStart(currentYear, currentQuarter as 1 | 2 | 3 | 4);
    const endDate = getQuarterEnd(currentYear, currentQuarter as 1 | 2 | 3 | 4);

    const months = [];
    const startMonth = (currentQuarter - 1) * 3;
    
    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(currentYear, startMonth + i, 1);
      const daysInMonth = new Date(currentYear, startMonth + i + 1, 0).getDate();
      months.push({
        name: ESTONIAN_MONTHS[startMonth + i],
        date: monthDate,
        daysInMonth
      });
    }

    return {
      year: currentYear,
      quarter: currentQuarter,
      startDate,
      endDate,
      months
    };
  }, [currentYear, currentQuarter]);

  // Filter and process tasks for current quarter
  const quarterTasks = useMemo(() => {
    return tasks.filter(task => 
      isTaskInQuarter(task, currentYear, currentQuarter as 1 | 2 | 3 | 4)
    );
  }, [tasks, currentYear, currentQuarter]);

  // Calculate task bar positions and handle overlaps
  const taskBars = useMemo((): TaskBarData[] => {
    if (quarterTasks.length === 0) return [];

    const totalDays = Math.ceil(
      (timelineData.endDate.getTime() - timelineData.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    // Calculate positions for each task
    const taskBarsData = quarterTasks.map((task): TaskBarData => {
      // Clamp task dates to quarter boundaries for display
      const displayStartDate = task.startDate < timelineData.startDate ? timelineData.startDate : task.startDate;
      const displayEndDate = task.endDate > timelineData.endDate ? timelineData.endDate : task.endDate;

      // Calculate position as percentage
      const startOffset = Math.max(0, 
        (displayStartDate.getTime() - timelineData.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const duration = Math.ceil(
        (displayEndDate.getTime() - displayStartDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      const left = (startOffset / totalDays) * 100;
      const width = (duration / totalDays) * 100;

      return {
        ...task,
        left,
        width: Math.max(width, 1), // Minimum 1% width
        row: 0, // Will be calculated below
        isPartial: task.startDate < timelineData.startDate || task.endDate > timelineData.endDate,
        continuesLeft: task.startDate < timelineData.startDate,
        continuesRight: task.endDate > timelineData.endDate
      };
    });

    // Handle overlapping tasks by assigning them to different rows
    const sortedTasks = [...taskBarsData].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const rows: TaskBarData[][] = [];

    sortedTasks.forEach(task => {
      // Find the first available row where this task doesn't overlap
      let assignedRow = -1;
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        const hasOverlap = row.some(existingTask => {
          const taskStart = task.startDate;
          const taskEnd = task.endDate;
          const existingStart = existingTask.startDate;
          const existingEnd = existingTask.endDate;
          
          return taskStart <= existingEnd && taskEnd >= existingStart;
        });

        if (!hasOverlap) {
          assignedRow = rowIndex;
          break;
        }
      }

      // If no available row found, create a new one
      if (assignedRow === -1) {
        assignedRow = rows.length;
        rows.push([]);
      }

      task.row = assignedRow;
      rows[assignedRow].push(task);
    });

    return taskBarsData;
  }, [quarterTasks, timelineData]);

  // Navigation handlers
  const handlePreviousQuarter = useCallback(() => {
    let newYear = currentYear;
    let newQuarter = currentQuarter - 1;
    
    if (newQuarter < 1) {
      newQuarter = 4;
      newYear -= 1;
    }
    
    onQuarterChange?.(newYear, newQuarter);
  }, [currentYear, currentQuarter, onQuarterChange]);

  const handleNextQuarter = useCallback(() => {
    let newYear = currentYear;
    let newQuarter = currentQuarter + 1;
    
    if (newQuarter > 4) {
      newQuarter = 1;
      newYear += 1;
    }
    
    onQuarterChange?.(newYear, newQuarter);
  }, [currentYear, currentQuarter, onQuarterChange]);

  // Calculate total height needed
  const maxRow = taskBars.length > 0 ? Math.max(...taskBars.map(t => t.row)) : -1;
  const chartHeight = Math.max(200, (maxRow + 1) * ROW_HEIGHT + HEADER_HEIGHT + 40);

  // Handle task click
  const handleTaskClick = useCallback((task: Task, event: React.MouseEvent) => {
    event.stopPropagation();
    onTaskClick?.(task);
  }, [onTaskClick]);

  return (
    <div className={`gantt-chart ${className}`}>
      {/* Header with quarter navigation */}
      <div className="gantt-header">
        <div className="quarter-navigation">
          <button 
            className="nav-button nav-prev"
            onClick={handlePreviousQuarter}
            aria-label="Previous quarter"
          >
            &#8249;
          </button>
          
          <div className="quarter-label">
            <h2>Q{currentQuarter} {currentYear}</h2>
          </div>
          
          <button 
            className="nav-button nav-next"
            onClick={handleNextQuarter}
            aria-label="Next quarter"
          >
            &#8250;
          </button>
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
                style={{ width: `${100/3}%` }}
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
        {/* Empty state */}
        {quarterTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No tasks for Q{currentQuarter} {currentYear}</h3>
            <p>Add some tasks to see them in the timeline.</p>
          </div>
        ) : (
          <div className="gantt-body">
            {/* Task names column */}
            <div className="task-names-column">
              {taskBars.map((taskBar) => (
                <div
                  key={taskBar.id}
                  className="task-name-row"
                  style={{
                    top: taskBar.row * ROW_HEIGHT,
                    height: TASK_HEIGHT
                  }}
                >
                  <div 
                    className={`task-name-label ${hoveredTask === taskBar.id ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredTask(taskBar.id)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    <span className="task-name-text" title={taskBar.name}>
                      {taskBar.name}
                    </span>
                    {taskBar.isPartial && (
                      <span className="partial-indicator" title="Task spans multiple quarters">
                        *
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline area */}
            <div className="timeline-area">
              {/* Timeline grid */}
              <div className="timeline-grid">
                {timelineData.months.map((month) => (
                  <div
                    key={month.name}
                    className="month-column"
                    style={{ 
                      left: `${(timelineData.months.indexOf(month) / 3) * 100}%`,
                      width: `${100/3}%`
                    }}
                  >
                    {/* Week dividers could be added here */}
                  </div>
                ))}
              </div>

              {/* Task bars */}
              {taskBars.map((taskBar) => (
                <div
                  key={taskBar.id}
                  className={`task-bar ${hoveredTask === taskBar.id ? 'hovered' : ''} ${taskBar.isPartial ? 'partial' : ''}`}
                  style={{
                    left: `${taskBar.left}%`,
                    width: `${taskBar.width}%`,
                    top: taskBar.row * ROW_HEIGHT,
                    height: TASK_HEIGHT,
                    backgroundColor: taskBar.color
                  }}
                  onClick={(e) => handleTaskClick(taskBar, e)}
                  onMouseEnter={() => setHoveredTask(taskBar.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                  title={`${taskBar.name}\n${taskBar.startDate.toLocaleDateString()} - ${taskBar.endDate.toLocaleDateString()}`}
                >
                  {/* Continuation indicators */}
                  {taskBar.continuesLeft && (
                    <div className="continuation-left">◄</div>
                  )}
                  {taskBar.continuesRight && (
                    <div className="continuation-right">►</div>
                  )}
                  
                  {/* Task name inside bar if there's space */}
                  <div className="task-bar-content">
                    <span className="task-bar-name">
                      {taskBar.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Basic test component
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
