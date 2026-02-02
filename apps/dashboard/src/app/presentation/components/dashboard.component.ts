import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StatsCardComponent } from './stats-card.component';
import { PomodoroTimerComponent } from './pomodoro-timer.component';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'Baixa' | 'Média' | 'Alta';
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
export class DashboardComponent implements OnInit {
  upcomingTasks: Task[] = [];
  allTasks: Task[] = [];
  totalTasks = 0;
  todoTasks = 0;
  inProgressTasks = 0;
  doneTasks = 0;
  highPriorityTasks = 0;
  completionPercentage = 0;

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
          this.allTasks = tasks;
          this.calculateStats();
          this.upcomingTasks = tasks
            .filter((task: Task) => task.status === 'in_progress')
            .slice(0, 5);
        } catch (error) {
          this.resetStats();
        }
      } else {
        setTimeout(() => {
          this.loadTasks();
        }, 500);
      }
    }
  }

  private calculateStats(): void {
    this.totalTasks = this.allTasks.length;
    this.todoTasks = this.allTasks.filter(task => task.status === 'todo').length;
    this.inProgressTasks = this.allTasks.filter(task => task.status === 'in_progress').length;
    this.doneTasks = this.allTasks.filter(task => task.status === 'done').length;
    this.highPriorityTasks = this.allTasks.filter(task => task.priority === 'Alta').length;
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