import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FilterPipe } from '../pipes/filter.pipe';
import { TaskFormDialogComponent } from './task-form-dialog.component';
import { Subscription } from 'rxjs';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'Baixa' | 'Média' | 'Alta';
  estimatedTime: number;
  subtasks: Subtask[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, FilterPipe, TaskFormDialogComponent],
  templateUrl: './tasks-page.component.html',
})
export class TasksPageComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private subscription?: Subscription;

  isDialogOpen = false;
  dialogTask: Task | null = null;
  dialogDefaultStatus: 'todo' | 'in_progress' | 'done' = 'todo';

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadTasks();
    }, 100);
  }

  async loadTasks(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        try {
          const tasks = await firebaseService.getUserTasks(user.uid);
          this.tasks = tasks;
        } catch (error) {
          this.tasks = [];
        }
      } else {
        setTimeout(() => {
          this.loadTasks();
        }, 500);
      }
    }
  }

  async saveTasks(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService) {
        const user = firebaseService.getCurrentUser();
        if (user) {
          await firebaseService.saveTasks(user.uid, this.tasks);
        }
      }
    }
  }

  ngOnDestroy(): void {}

  openNewTaskDialog(status?: 'todo' | 'in_progress' | 'done'): void {
    this.dialogTask = null;
    this.dialogDefaultStatus = status || 'todo';
    this.isDialogOpen = true;
  }

  openEditTaskDialog(task: Task): void {
    this.dialogTask = task;
    this.isDialogOpen = true;
  }

  onDialogOpenChange(isOpen: boolean): void {
    this.isDialogOpen = isOpen;
  }

  async onTaskSubmit(taskData: any): Promise<void> {
    if (this.dialogTask) {
      const index = this.tasks.findIndex(t => t.id === this.dialogTask!.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.dialogTask, ...taskData, updatedAt: new Date() };
      }
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        status: this.dialogDefaultStatus,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.tasks.push(newTask);
    }
    await this.saveTasks();
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Alta':
        return '#EF4444';
      case 'Média':
        return '#F59E0B';
      case 'Baixa':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  }
}
