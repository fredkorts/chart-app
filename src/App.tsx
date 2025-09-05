import React, { useState } from 'react';
import './App.css';
import './components/tasks.css';

import type { Task } from '@/types';
import { GanttChart } from '@/features/gantt';
import { useTasks } from '@/features/tasks';

function App() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [quarter, setQuarter] = useState<1 | 2 | 3 | 4>(
    (Math.ceil((new Date().getMonth() + 1) / 3) as 1 | 2 | 3 | 4)
  );

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    await addTask(task);
  };

  const handleQuarterChange = (newYear: number, newQuarter: 1 | 2 | 3 | 4) => {
    setYear(newYear);
    setQuarter(newQuarter);
  };

  const handleEditTask = async (
    taskId: string,
    updatedTask: Omit<Task, 'id'>
  ) => {
    return updateTask(taskId, updatedTask);
  };

  const handleDeleteTask = async (taskId: string) => {
    return deleteTask(taskId);
  };

  return (
    <div className="app-container">
      <div className="gantt-container">
        <GanttChart
          tasks={tasks}
          currentYear={year}
          currentQuarter={quarter}
          onQuarterChange={handleQuarterChange}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default App;
