import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StatsCardComponent } from './stats-card.component';
import { PomodoroTimerComponent } from './pomodoro-timer.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, interval } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  subtasks: any[];
  tags: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, StatsCardComponent, PomodoroTimerComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  upcomingTasks: Task[] = [];
  allTasks: Task[] = [];
  totalTasks = 0;
  todoTasks = 0;
  inProgressTasks = 0;
  doneTasks = 0;
  highPriorityTasks = 0;
  completionPercentage = 0;
  presentationMode = false;
  private subscription?: Subscription;
  private refreshSubscription?: Subscription;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.presentationMode = localStorage.getItem('presentationMode') === 'true';
    this.loadTasks();
    
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && (event.url === '/' || event.url.includes('/dashboard'))) {
        setTimeout(() => this.loadTasks(), 0);
      }
    });

    this.refreshSubscription = interval(5000).subscribe(() => {
      this.loadTasks();
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('tasksUpdated', () => this.loadTasks());
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
    if (typeof window !== 'undefined') {
      window.removeEventListener('tasksUpdated', () => this.loadTasks());
    }
  }

  async loadTasks(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService) {
        const user = await firebaseService.waitForUser();
        if (user) {
          try {
            const tasks = await firebaseService.getUserTasks(user.uid);
            this.allTasks = tasks;
            this.calculateStats();
            this.upcomingTasks = tasks
              .filter((task: Task) => task.status === 'in_progress')
              .slice(0, 5);
            this.cdr.detectChanges();
          } catch (error) {
            this.resetStats();
          }
        }
      }
    }
  }

  private calculateStats(): void {
    this.totalTasks = this.allTasks.length;
    this.todoTasks = this.allTasks.filter(task => task.status === 'todo').length;
    this.inProgressTasks = this.allTasks.filter(task => task.status === 'in_progress').length;
    this.doneTasks = this.allTasks.filter(task => task.status === 'done').length;
    this.highPriorityTasks = this.allTasks.filter(task => task.priority === 'high').length;
    this.completionPercentage = this.totalTasks > 0 ? Math.round((this.doneTasks / this.totalTasks) * 100) : 0;
  }

  private resetStats(): void {
    this.allTasks = [];
    this.upcomingTasks = [];
    this.totalTasks = 0;
    this.todoTasks = 0;
    this.inProgressTasks = 0;
    this.doneTasks = 0;
    this.highPriorityTasks = 0;
    this.completionPercentage = 0;
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

  getCompletedSubtasksCount(subtasks: any[]): number {
    return subtasks?.filter(s => s.completed).length || 0;
  }

  testNotification(type: 'info' | 'success' | 'warning' | 'transition'): void {
    const messages = {
      info: 'Teste de notificação informativa',
      success: 'Teste de notificação de sucesso',
      warning: 'Teste de notificação de aviso',
      transition: 'Teste de transição de atividade'
    };
    
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: { type, message: messages[type], duration: 5000 }
    }));
  }

  testAllNotifications(): void {
    const notificationService = (window as any).accessibilityService?.notificationService;
    if (notificationService) {
      setTimeout(() => this.testNotification('info'), 0);
      setTimeout(() => this.testNotification('success'), 1000);
      setTimeout(() => this.testNotification('warning'), 2000);
      setTimeout(() => notificationService.showTransitionAlert('Estudar', 'Pausar'), 3000);
      setTimeout(() => notificationService.showFocusBreakAlert(), 4000);
      setTimeout(() => notificationService.showBreakEndAlert(), 5000);
    }
  }
}