import { Injectable } from '@angular/core';
import { Task, Subtask, TaskStatus } from '../types/task.types';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private getFirebaseService() {
    return (window as any).firebaseService;
  }

  private getCognitiveAlertsService() {
    return (window as any).cognitiveAlertsService;
  }

  async loadTasks(): Promise<Task[]> {
    const firebaseService = this.getFirebaseService();
    if (!firebaseService) return [];

    const user = await firebaseService.waitForUser();
    if (!user) return [];

    try {
      return await firebaseService.getUserTasks(user.uid);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  }

  async saveTask(task: Task): Promise<string> {
    const firebaseService = this.getFirebaseService();
    const user = firebaseService?.getCurrentUser();
    
    if (!user || !firebaseService) throw new Error('Usuário não autenticado');

    return await firebaseService.saveTask(user.uid, task);
  }

  async deleteTask(taskId: string): Promise<void> {
    const firebaseService = this.getFirebaseService();
    const user = firebaseService?.getCurrentUser();
    
    if (!user || !firebaseService) throw new Error('Usuário não autenticado');

    await firebaseService.deleteTask(user.uid, taskId);
  }

  async updateTaskStatus(task: Task, newStatus: TaskStatus): Promise<Task> {
    const updatedTask = {
      ...task,
      status: newStatus,
      updatedAt: new Date()
    };

    await this.saveTask(updatedTask);
    this.handleTaskStatusChange(task.id, newStatus);
    
    return updatedTask;
  }

  async addSubtask(task: Task, subtaskTitle: string): Promise<Task> {
    const newSubtask: Subtask = {
      id: 'subtask_' + Date.now(),
      title: subtaskTitle.trim(),
      completed: false
    };

    const updatedTask = {
      ...task,
      subtasks: [...task.subtasks, newSubtask],
      updatedAt: new Date()
    };

    await this.saveTask(updatedTask);
    return updatedTask;
  }

  getNextStatus(currentStatus: TaskStatus): TaskStatus {
    const statusOrder: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  }

  getStatusName(status: TaskStatus): string {
    const statusNames = {
      todo: 'A Fazer',
      in_progress: 'Em Progresso',
      done: 'Concluído'
    };
    return statusNames[status];
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'var(--priority-high)';
      case 'medium':
        return 'var(--priority-medium)';
      case 'low':
        return 'var(--priority-low)';
      default:
        return '#6B7280';
    }
  }

  getCompletedSubtasksCount(subtasks: Subtask[]): number {
    return subtasks.filter(s => s.completed).length;
  }

  private handleTaskStatusChange(taskId: string, newStatus: TaskStatus): void {
    const cognitiveAlertsService = this.getCognitiveAlertsService();
    if (!cognitiveAlertsService) return;

    if (newStatus === 'in_progress') {
      cognitiveAlertsService.startTaskTracking(taskId);
    } else {
      cognitiveAlertsService.stopTaskTracking();
    }
  }

  notifyTasksUpdated(): void {
    window.dispatchEvent(new CustomEvent('tasksUpdated'));
  }
}
