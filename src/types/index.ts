export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Partial<Task> = {
  id?: string;
  name?: string; 
  startDate?: Date;
  endDate?: Date;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Quarter navigation
export interface Quarter {
  year: number;
  quarter: 1 | 2 | 3 | 4;
}

// Gantt chart specific types
export interface TaskPosition {
  left: string;
  width: string;
}

export interface TimelineRange {
  start: Date;
  end: Date;
}

// Form data (before validation)
export interface TaskFormData {
  name: string;
  startDateStr: string;
  endDateStr: string;
}