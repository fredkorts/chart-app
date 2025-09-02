import React, { useState } from 'react';
import './App.css';
import './components/tasks.css';

import type { Task } from '@/types';
import { GanttChart } from '@/features/gantt';
import {
  TaskForm,
  TaskDetailsModal,
  useTasks,
} from '@/features/tasks';

function App() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [quarter, setQuarter] = useState<1 | 2 | 3 | 4>(
    (Math.ceil((new Date().getMonth() + 1) / 3) as 1 | 2 | 3 | 4)
  );

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    await addTask(task);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
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
      <div className="task-form-container">
        <TaskForm onSubmit={handleAddTask} />
      </div>
      <div className="gantt-container">
        <GanttChart
          tasks={tasks}
          currentYear={year}
          currentQuarter={quarter}
          onTaskClick={handleTaskClick}
          onQuarterChange={handleQuarterChange}
        />
      </div>
      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}

export default App;
