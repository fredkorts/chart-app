import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../useTasks';
import type { Task } from '@/types';

// Mock the dependencies
vi.mock('@/utils/dateUtils', () => ({
  generateTaskId: () => 'test-id-123',
}));

vi.mock('@/utils/constants', () => ({
  getTaskColor: () => '#3B82F6',
  VALIDATION_MESSAGES: {
    SAVE_TASK_FAILED: 'Failed to save task',
  },
}));

const validateTaskMock = vi.fn().mockReturnValue(true);
const getFormErrorsMock = vi.fn().mockReturnValue({});

vi.mock('../useTaskValidation', () => ({
  useTaskValidation: () => ({
    validateTask: validateTaskMock,
    getFormErrors: getFormErrorsMock,
    validateEstonianDate: vi.fn().mockReturnValue(true),
    validateTaskForm: vi.fn(),
  }),
}));

describe('useTasks', () => {
  const mockTask: Omit<Task, 'id'> = {
    name: 'Test Task',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-01-31'),
    color: '#3B82F6',
  };

  it('should initialize with empty tasks by default', () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toEqual([]);
    expect(result.current.taskCount).toBe(0);
    expect(result.current.hasActiveTasks).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should initialize with provided initial tasks', () => {
    const initialTasks: Task[] = [
      { id: '1', ...mockTask },
    ];

    const { result } = renderHook(() => 
      useTasks({ initialTasks })
    );
    
    expect(result.current.tasks).toEqual(initialTasks);
    expect(result.current.taskCount).toBe(1);
  });

  it('should add a task successfully', async () => {
    const { result } = renderHook(() => useTasks());
    
    let addResult;
    await act(async () => {
      addResult = await result.current.addTask(mockTask);
    });

    expect(addResult).toEqual({
      success: true,
      task: expect.objectContaining({
        id: 'test-id-123',
        name: 'Test Task',
      }),
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.taskCount).toBe(1);
  });

  it('should update a task successfully', async () => {
    const initialTasks: Task[] = [{ id: 'task-1', ...mockTask }];
    const { result } = renderHook(() => useTasks({ initialTasks }));

    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateTask('task-1', { name: 'Updated Task' });
    });

    expect(updateResult).toEqual({
      success: true,
      task: expect.objectContaining({ id: 'task-1', name: 'Updated Task' }),
    });
    expect(result.current.tasks[0].name).toBe('Updated Task');
  });

  it('should delete a task successfully', async () => {
    const initialTasks: Task[] = [
      { id: 'task-1', ...mockTask },
    ];

    const { result } = renderHook(() => 
      useTasks({ initialTasks })
    );
    
    let deleteResult;
    await act(async () => {
      deleteResult = await result.current.deleteTask('task-1');
    });

    expect(deleteResult).toEqual({ success: true });
    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.taskCount).toBe(0);
  });

  it('should get task by id', () => {
    const initialTasks: Task[] = [
      { id: 'task-1', ...mockTask },
    ];

    const { result } = renderHook(() => 
      useTasks({ initialTasks })
    );
    
    const foundTask = result.current.getTaskById('task-1');
    expect(foundTask).toEqual(initialTasks[0]);
    
    const notFoundTask = result.current.getTaskById('non-existent');
    expect(notFoundTask).toBeUndefined();
  });

  it('should handle validation errors when updating a task', async () => {
    const initialTasks: Task[] = [{ id: 'task-1', ...mockTask }];
    const { result } = renderHook(() => useTasks({ initialTasks }));

    validateTaskMock.mockReturnValueOnce(false);
    getFormErrorsMock.mockReturnValueOnce({ name: 'Required' });

    const updateResult = await result.current.updateTask('task-1', { name: '' });

    expect(updateResult).toEqual({ success: false, errors: { name: 'Required' } });
  });
});
