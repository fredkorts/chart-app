export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Partial<Task> = {
  id?: string;      // Optional
  name?: string;    // Optional  
  startDate?: Date; // Optional
  endDate?: Date;   // Optional
}

export interface ValidationError {
  field: string;
  message: string;
}