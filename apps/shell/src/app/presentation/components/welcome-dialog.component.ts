import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WelcomeUseCase } from '../../domain/usecases/welcome.usecase';
import { LocalStorageWelcomeRepository } from '../../data/repositories/welcome.repository';

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './welcome-dialog.component.html',
})
export class WelcomeDialogComponent implements OnInit {
  isOpen = false;
  features = [
    {
      title: 'Dashboard Intuitivo',
      description: 'Visualize suas tarefas e progresso de forma clara e organizada',
    },
    {
      title: 'Organizador de Tarefas Kanban',
      description: 'Gerencie suas atividades com um sistema visual simplificado',
    },
    {
      title: 'Timer Pomodoro Adaptado',
      description: 'Mantenha o foco com sessões personalizáveis de trabalho e pausa',
    },
    {
      title: 'Painel Cognitivo Personalizável',
      description: 'Ajuste contraste, espaçamento, tamanho de fonte e complexidade da interface',
    },
    {
      title: 'Alertas Cognitivos',
      description: 'Receba lembretes sobre pausas e gerenciamento de foco',
    },
  ];

  private useCase: WelcomeUseCase;

  constructor() {
    const repository = new LocalStorageWelcomeRepository();
    this.useCase = new WelcomeUseCase(repository);
  }

  ngOnInit(): void {
    this.isOpen = this.useCase.shouldShowWelcome();
  }

  close(): void {
    this.useCase.dismissWelcome();
    this.isOpen = false;
  }
}
