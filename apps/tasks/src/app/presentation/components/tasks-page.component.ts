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
    this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService) {
        const user = firebaseService.getCurrentUser();
        if (user) {
          try {
            const tasks = await firebaseService.getUserTasks(user.uid);
            this.tasks = tasks;
          } catch (error) {
            this.tasks = [];
          }
        } else {
          // Aguarda o usuário estar disponível
          const checkUser = () => {
            const currentUser = firebaseService.getCurrentUser();
            if (currentUser) {
              this.loadTasks();
            } else {
              setTimeout(checkUser, 100);
            }
          };
          checkUser();
        }
      } else {
        // Aguarda o firebaseService estar disponível
        const checkService = () => {
          const service = (window as any).firebaseService;
          if (service) {
            this.loadTasks();
          } else {
            setTimeout(checkService, 100);
          }
        };
        checkService();
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
    this.showSuccessMessage(this.dialogTask ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!');
  }

  private showSuccessMessage(message: string): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: message,
          duration: 3000
        }
      });
      window.dispatchEvent(event);
    }
  }

  private draggedTask: Task | null = null;

  async toggleTaskStatus(task: Task): Promise<void> {
    const statusOrder: ('todo' | 'in_progress' | 'done')[] = ['todo', 'in_progress', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        status: statusOrder[nextIndex],
        updatedAt: new Date()
      };
      await this.saveTasks();
      
      const statusNames = { todo: 'A Fazer', in_progress: 'Em Progresso', done: 'Concluído' };
      this.showSuccessMessage(`Tarefa movida para: ${statusNames[statusOrder[nextIndex]]}`);
    }
  }

  onDragStart(event: DragEvent, task: Task): void {
    this.draggedTask = task;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  async onDrop(event: DragEvent, newStatus: 'todo' | 'in_progress' | 'done'): Promise<void> {
    event.preventDefault();
    
    if (this.draggedTask && this.draggedTask.status !== newStatus) {
      const index = this.tasks.findIndex(t => t.id === this.draggedTask!.id);
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          status: newStatus,
          updatedAt: new Date()
        };
        await this.saveTasks();
        
        const statusNames = { todo: 'A Fazer', in_progress: 'Em Progresso', done: 'Concluído' };
        this.showSuccessMessage(`Tarefa movida para: ${statusNames[newStatus]}`);
      }
    }
    
    this.draggedTask = null;
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

  getCompletedSubtasks(task: Task): number {
    return task.subtasks?.filter(s => s.completed).length || 0;
  }

  getTotalSubtasks(task: Task): number {
    return task.subtasks?.length || 0;
  }
}
