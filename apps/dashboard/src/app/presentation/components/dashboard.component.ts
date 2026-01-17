import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StatsCardComponent } from './stats-card.component';
import { PomodoroTimerComponent } from './pomodoro-timer.component';

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, StatsCardComponent, PomodoroTimerComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  upcomingTasks: Task[] = [
    {
      id: '1',
      title: 'Revisar conteúdo de React',
      priority: 'Alta',
      status: 'Em Progresso',
    },
    {
      id: '2',
      title: 'Preparar apresentação final',
      priority: 'Alta',
      status: 'Em Progresso',
    },
  ];
}