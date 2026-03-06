export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedTime: number;
  subtasks: Subtask[];
  tags: string[];
  dueDate?: string;
  userId?: string;
  createdAt?: number;
  updatedAt?: number;
}
