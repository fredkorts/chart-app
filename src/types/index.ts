export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}