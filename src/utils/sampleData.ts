import type { Task } from '../types';
import { parseEstonianDate } from './dateUtils';
import { getTaskColor } from './constants';

export const createSampleTasks = (): Task[] => {
  const tasks: Omit<Task, 'id' | 'color'>[] = [
    {
      name: 'task 1',
      startDate: parseEstonianDate('23.01.2023')!,
      endDate: parseEstonianDate('27.01.2023')!,
    },
    {
      name: 'task 2', 
      startDate: parseEstonianDate('21.02.2023')!,
      endDate: parseEstonianDate('03.03.2023')!,
    },
    {
      name: 'task 3',
      startDate: parseEstonianDate('30.01.2023')!,
      endDate: parseEstonianDate('20.03.2023')!,
    },
    {
      name: 'task 4',
      startDate: parseEstonianDate('28.02.2023')!,
      endDate: parseEstonianDate('01.03.2023')!,
    },
  ];

  return tasks.map((task, index) => ({
    ...task,
    id: (index + 1).toString(),
    color: getTaskColor(index),
  }));
};