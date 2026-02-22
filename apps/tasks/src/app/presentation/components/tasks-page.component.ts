import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FilterPipe } from '../pipes/filter.pipe';
import { TaskFormDialogComponent } from './task-form-dialog.component';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

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
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  subtasks: Subtask[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, FilterPipe, TaskFormDialogComponent, FormsModule],
  templateUrl: './tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksPageComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private subscription?: Subscription;
  addingSubtaskFor: string | null = null;
  newSubtaskTitle: string = '';
  isLoading = false;
  deletingTaskId: string | null = null;

  isDialogOpen = false;
  dialogTask: Task | null = null;
  dialogDefaultStatus: 'todo' | 'in_progress' | 'done' = 'todo';

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks();
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url.includes('/tasks')) {
        setTimeout(() => this.loadTasks(), 0);
      }
    });
  }

  async loadTasks(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService) {
        const user = await firebaseService.waitForUser();
        if (user) {
          try {
            const tasks = await firebaseService.getUserTasks(user.uid);
            this.tasks = tasks || [];
            this.cdr.markForCheck();
          } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            this.tasks = [];
            this.cdr.markForCheck();
          }
        }
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

  async refreshTasks(): Promise<void> {
    await this.loadTasks();
    this.showSuccessMessage('Tarefas atualizadas!');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openNewTaskDialog(status?: 'todo' | 'in_progress' | 'done'): void {
    this.dialogTask = null;
    this.dialogDefaultStatus = status || 'todo';
    this.cdr.markForCheck();
    this.isDialogOpen = true;
    this.cdr.markForCheck();
  }

  openEditTaskDialog(task: Task): void {
    this.dialogTask = task;
    this.cdr.markForCheck();
    this.isDialogOpen = true;
    this.cdr.markForCheck();
  }

  onDialogOpenChange(isOpen: boolean): void {
    this.isDialogOpen = isOpen;
    if (!isOpen) {
      this.dialogTask = null;
    }
    this.cdr.markForCheck();
  }

  async onTaskSubmit(taskData: any): Promise<void> {
    const firebaseService = (window as any).firebaseService;
    const user = firebaseService?.getCurrentUser();
    
    if (!user) {
      this.showErrorMessage('Erro: Usuário não autenticado');
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();
    try {
      if (this.dialogTask) {
        const updatedTask = { ...this.dialogTask, ...taskData, updatedAt: new Date() };
        await firebaseService.saveTask(user.uid, updatedTask);
        await this.loadTasks();
        this.showSuccessMessage('Tarefa atualizada com sucesso!');
      } else {
        const newTask: Task = {
          id: 'task_' + Date.now(),
          ...taskData,
          status: this.dialogDefaultStatus,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const taskId = await firebaseService.saveTask(user.uid, newTask);
        newTask.id = taskId;
        this.tasks.push(newTask);
        this.showSuccessMessage('Tarefa criada com sucesso!');
      }
      
      await this.loadTasks();
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tasksUpdated'));
      }
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      this.showErrorMessage('Erro ao salvar tarefa. Verifique suas permissões.');
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private showErrorMessage(message: string): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'warning',
          message: message,
          duration: 5000
        }
      });
      window.dispatchEvent(event);
    }
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
    
    const firebaseService = (window as any).firebaseService;
    const user = firebaseService?.getCurrentUser();
    if (!user) return;

    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        status: statusOrder[nextIndex],
        updatedAt: new Date()
      };
      await firebaseService.saveTask(user.uid, this.tasks[index]);
      await this.loadTasks();
      
      const statusNames = { todo: 'A Fazer', in_progress: 'Em Progresso', done: 'Concluído' };
      this.showSuccessMessage(`Tarefa movida para: ${statusNames[statusOrder[nextIndex]]}`);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tasksUpdated'));
      }
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
      const firebaseService = (window as any).firebaseService;
      const user = firebaseService?.getCurrentUser();
      if (!user) return;

      const index = this.tasks.findIndex(t => t.id === this.draggedTask!.id);
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          status: newStatus,
          updatedAt: new Date()
        };
        await firebaseService.saveTask(user.uid, this.tasks[index]);
        await this.loadTasks();
        
        const statusNames = { todo: 'A Fazer', in_progress: 'Em Progresso', done: 'Concluído' };
        this.showSuccessMessage(`Tarefa movida para: ${statusNames[newStatus]}`);
        
        if (newStatus === 'in_progress' && typeof window !== 'undefined') {
          const cognitiveAlertsService = (window as any).cognitiveAlertsService;
          if (cognitiveAlertsService) {
            cognitiveAlertsService.startTaskTracking(this.draggedTask.id);
          }
        } else if (newStatus !== 'in_progress' && typeof window !== 'undefined') {
          const cognitiveAlertsService = (window as any).cognitiveAlertsService;
          if (cognitiveAlertsService) {
            cognitiveAlertsService.stopTaskTracking();
          }
        }
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('tasksUpdated'));
        }
      }
    }
    
    this.draggedTask = null;
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
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

  async deleteTask(task: Task, event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }
    
    this.deletingTaskId = task.id;
    this.cdr.markForCheck();
    const firebaseService = (window as any).firebaseService;
    const user = firebaseService?.getCurrentUser();
    if (!user) {
      this.deletingTaskId = null;
      this.cdr.markForCheck();
      return;
    }

    try {
      await firebaseService.deleteTask(user.uid, task.id);
      await this.loadTasks();
      this.showSuccessMessage('Tarefa excluída com sucesso!');
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tasksUpdated'));
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      this.showErrorMessage('Erro ao excluir tarefa');
    } finally {
      this.deletingTaskId = null;
      this.cdr.markForCheck();
    }
  }

  showAddSubtask(taskId: string): void {
    this.addingSubtaskFor = taskId;
    this.newSubtaskTitle = '';
    this.cdr.markForCheck();
  }

  cancelAddSubtask(): void {
    this.addingSubtaskFor = null;
    this.newSubtaskTitle = '';
    this.cdr.markForCheck();
  }

  async addSubtask(task: Task): Promise<void> {
    if (!this.newSubtaskTitle.trim()) return;

    const firebaseService = (window as any).firebaseService;
    const user = firebaseService?.getCurrentUser();
    if (!user) return;

    const newSubtask: Subtask = {
      id: 'subtask_' + Date.now(),
      title: this.newSubtaskTitle.trim(),
      completed: false
    };

    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        subtasks: [...(this.tasks[index].subtasks || []), newSubtask],
        updatedAt: new Date()
      };
      await firebaseService.saveTask(user.uid, this.tasks[index]);
      await this.loadTasks();
      this.showSuccessMessage('Subtarefa adicionada!');
      this.cancelAddSubtask();
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tasksUpdated'));
      }
    }
  }

  getTaskCountByStatus(status: 'todo' | 'in_progress' | 'done'): number {
    return this.tasks.filter(t => t.status === status).length;
  }
}
