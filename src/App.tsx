import React, { useState, useRef, useEffect } from 'react';
import './App.css';

import type { Task } from '@/types';
import { GanttChart } from '@/features/gantt';
import { useTasks, TaskNotification } from '@/features/tasks';
import type { TaskNotificationRef } from '@/features/tasks';
import { Layout, ConfigProvider, theme } from 'antd';

const { Content } = Layout;

function App() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks();
  const notificationRef = useRef<TaskNotificationRef>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [quarter, setQuarter] = useState<1 | 2 | 3 | 4>(
    (Math.ceil((new Date().getMonth() + 1) / 3) as 1 | 2 | 3 | 4)
  );

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    const result = await addTask(task);
    if (result.success) {
      notificationRef.current?.showAdd();
    }
  };

  const handleQuarterChange = (newYear: number, newQuarter: 1 | 2 | 3 | 4) => {
    setYear(newYear);
    setQuarter(newQuarter);
  };

  const handleEditTask = async (
    taskId: string,
    updatedTask: Omit<Task, 'id'>
  ) => {
    const result = await updateTask(taskId, updatedTask);
    if (result.success) {
      notificationRef.current?.showUpdate();
    }
    return result;
  };

  const handleDeleteTask = async (taskId: string) => {
    const taskName = tasks.find(t => t.id === taskId)?.name || '';
    const result = await deleteTask(taskId);
    if (result.success) {
      notificationRef.current?.showDelete(taskName);
    }
    return result;
  };

  useEffect(() => {
    const themeName = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
  }, [darkMode]);

  return (
    <ConfigProvider
      theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <Layout style={{ height: '100vh', width: '100vw', position: 'relative' }}>
        <TaskNotification ref={notificationRef} />
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(prev => !prev)}
        >
          {darkMode ? 'Dark Mode' : 'Light Mode'}
        </button>
        <Layout className='app-container'>
          <Content>
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
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
