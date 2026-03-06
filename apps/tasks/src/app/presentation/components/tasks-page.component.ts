import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FilterPipe } from '../pipes/filter.pipe';
import { TaskFormDialogComponent } from './task-form-dialog.component';
import { EmptyStateComponent } from './empty-state.component';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { Task, TaskStatus, Subtask } from '../../types/task.types';
import { TasksService } from '../../services/tasks.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, FilterPipe, TaskFormDialogComponent, EmptyStateComponent, FormsModule],
  templateUrl: './tasks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksPageComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private subscription?: Subscription;
  addingSubtaskFor: string | null = null;
  newSubtaskTitle = '';
  isLoading = false;
  deletingTaskId: string | null = null;
  private draggedTask: Task | null = null;

  isDialogOpen = false;
  dialogTask: Task | null = null;
  dialogDefaultStatus: TaskStatus = 'todo';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private tasksService: TasksService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url.includes('/tasks')) {
        setTimeout(() => this.loadTasks(), 0);
      }
    });
  }

  async loadTasks(): Promise<void> {
    this.tasks = await this.tasksService.loadTasks();
    this.cdr.markForCheck();
  }

  async refreshTasks(): Promise<void> {
    await this.loadTasks();
    this.notificationService.showSuccess('Tarefas atualizadas!');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openNewTaskDialog(status?: TaskStatus): void {
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

  async onTaskSubmit(taskData: Partial<Task>): Promise<void> {
    this.isLoading = true;
    this.cdr.markForCheck();
    
    try {
      if (this.dialogTask) {
        const updatedTask = { ...this.dialogTask, ...taskData, updatedAt: new Date() };
        await this.tasksService.saveTask(updatedTask);
        this.notificationService.showSuccess('Tarefa atualizada com sucesso!');
      } else {
        const newTask: Task = {
          id: 'task_' + Date.now(),
          title: taskData.title || '',
          description: taskData.description || '',
          status: this.dialogDefaultStatus,
          priority: taskData.priority || 'medium',
          estimatedTime: taskData.estimatedTime || 0,
          subtasks: taskData.subtasks || [],
          tags: taskData.tags || [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await this.tasksService.saveTask(newTask);
        this.notificationService.showSuccess('Tarefa criada com sucesso!');
      }
      
      await this.loadTasks();
      this.tasksService.notifyTasksUpdated();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      this.notificationService.showError('Erro ao salvar tarefa. Verifique suas permissões.');
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  async toggleTaskStatus(task: Task): Promise<void> {
    try {
      const newStatus = this.tasksService.getNextStatus(task.status);
      await this.tasksService.updateTaskStatus(task, newStatus);
      await this.loadTasks();
      this.notificationService.showSuccess(`Tarefa movida para: ${this.tasksService.getStatusName(newStatus)}`);
      this.tasksService.notifyTasksUpdated();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      this.notificationService.showError('Erro ao atualizar tarefa');
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

  async onDrop(event: DragEvent, newStatus: TaskStatus): Promise<void> {
    event.preventDefault();
    
    if (this.draggedTask && this.draggedTask.status !== newStatus) {
      try {
        await this.tasksService.updateTaskStatus(this.draggedTask, newStatus);
        await this.loadTasks();
        this.notificationService.showSuccess(`Tarefa movida para: ${this.tasksService.getStatusName(newStatus)}`);
        this.tasksService.notifyTasksUpdated();
      } catch (error) {
        console.error('Erro ao mover tarefa:', error);
        this.notificationService.showError('Erro ao mover tarefa');
      }
    }
    
    this.draggedTask = null;
  }

  getPriorityColor(priority: string): string {
    return this.tasksService.getPriorityColor(priority);
  }

  getCompletedSubtasks(task: Task): number {
    return this.tasksService.getCompletedSubtasksCount(task.subtasks);
  }

  getTotalSubtasks(task: Task): number {
    return task.subtasks.length;
  }

  async deleteTask(task: Task, event?: Event): Promise<void> {
    if (event) event.stopPropagation();
    
    this.deletingTaskId = task.id;
    this.cdr.markForCheck();

    try {
      await this.tasksService.deleteTask(task.id);
      await this.loadTasks();
      this.notificationService.showSuccess('Tarefa excluída com sucesso!');
      this.tasksService.notifyTasksUpdated();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      this.notificationService.showError('Erro ao excluir tarefa');
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

    try {
      await this.tasksService.addSubtask(task, this.newSubtaskTitle);
      await this.loadTasks();
      this.notificationService.showSuccess('Subtarefa adicionada!');
      this.cancelAddSubtask();
      this.tasksService.notifyTasksUpdated();
    } catch (error) {
      console.error('Erro ao adicionar subtarefa:', error);
      this.notificationService.showError('Erro ao adicionar subtarefa');
    }
  }

  getTaskCountByStatus(status: TaskStatus): number {
    return this.tasks.filter(t => t.status === status).length;
  }
}
