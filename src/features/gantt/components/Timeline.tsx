import React, { useState } from 'react';
import type { Task } from '@/types';
import { TaskBar } from './TaskBar';
import type { TaskBarData, TimelineData } from '../types/gantt.types';

interface TimelineProps {
  timelineData: TimelineData;
  tasks: TaskBarData[];
  rowHeight: number;
  taskHeight: number;
  onTaskClick?: (task: Task, event: React.MouseEvent) => void;
  className?: string;
}

const TimelineComponent: React.FC<TimelineProps> = ({
  timelineData,
  tasks,
  rowHeight,
  taskHeight,
  onTaskClick,
  className = ''
}) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const totalDays = (timelineData.endDate.getTime() - timelineData.startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
  const now = new Date();

  return (
    <div className={`timeline-area ${className}`}>
      <div className="timeline-grid">
        <div className="month-columns">
          {timelineData.months.map((month) => (
            <div
              key={month.name}
              className="month-column"
              style={{ width: `${100 / timelineData.months.length}%` }}
            />
          ))}
        </div>
        <div className="week-columns">
          {timelineData.weeks.map((week) => {
            const width = (week.days / totalDays) * 100;
            const isCurrent = now >= week.startDate && now <= week.endDate;
            return (
              <div
                key={`week-${week.weekNumber}-${week.startDate.toISOString()}`}
                className={`week-column${isCurrent ? ' current-week current' : ''}`}
                style={{ width: `${width}%` }}
              />
            );
          })}
        </div>
      </div>

      {tasks.map(task => (
        <TaskBar
          key={task.id}
          task={task}
          rowHeight={rowHeight}
          taskHeight={taskHeight}
          isHovered={hovered === task.id}
          onHover={setHovered}
          onClick={onTaskClick}
        />
      ))}
    </div>
  );
};

export const Timeline = React.memo(TimelineComponent);

export default Timeline;

