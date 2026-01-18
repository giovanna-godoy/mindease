import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FilterPipe } from '../pipes/filter.pipe';
import { TaskFormDialogComponent } from './task-form-dialog.component';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'Baixa' | 'Média' | 'Alta';
  estimatedTime: number;
  subtasks: Subtask[];
  tags: string[];
}

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, FilterPipe, TaskFormDialogComponent],
  templateUrl: './tasks-page.component.html',
})
export class TasksPageComponent {
  tasks: Task[] = [
    {
      id: '1',
      title: 'Fazer exercícios de acessibilidade',
      description: 'Praticar ARIA labels e navegação por teclado',
      status: 'todo',
      priority: 'Média',
      estimatedTime: 90,
      subtasks: [
        { id: '1-1', title: 'Ler documentação WCAG', completed: false },
        { id: '1-2', title: 'Implementar navegação por teclado', completed: false },
      ],
      tags: ['Acessibilidade', 'A11y'],
    },
    {
      id: '2',
      title: 'Configurar ambiente de testes',
      description: 'Instalar e configurar Jest e React Testing Library',
      status: 'todo',
      priority: 'Baixa',
      estimatedTime: 45,
      subtasks: [],
      tags: ['Testes', 'Configuração'],
    },
    {
      id: '3',
      title: 'Revisar conteúdo de React',
      description: 'Estudar hooks, context API e performance optimization',
      status: 'in_progress',
      priority: 'Alta',
      estimatedTime: 120,
      subtasks: [
        { id: '3-1', title: 'Estudar useState e useEffect', completed: true },
        { id: '3-2', title: 'Praticar useContext', completed: true },
        { id: '3-3', title: 'Revisar useMemo e useCallback', completed: false },
      ],
      tags: ['React', 'Frontend'],
    },
    {
      id: '4',
      title: 'Preparar apresentação final',
      description: 'Criar slides e ensaiar apresentação do projeto MindEase',
      status: 'in_progress',
      priority: 'Alta',
      estimatedTime: 60,
      subtasks: [
        { id: '4-1', title: 'Criar estrutura dos slides', completed: true },
        { id: '4-2', title: 'Adicionar capturas de tela', completed: false },
        { id: '4-3', title: 'Ensaiar apresentação', completed: false },
      ],
      tags: ['Apresentação', 'MindEase'],
    },
    {
      id: '5',
      title: 'Concluir projeto de API Rest',
      description: 'Finalizar endpoints e documentação',
      status: 'done',
      priority: 'Alta',
      estimatedTime: 180,
      subtasks: [
        { id: '5-1', title: 'Criar endpoints CRUD', completed: true },
        { id: '5-2', title: 'Adicionar autenticação', completed: true },
        { id: '5-3', title: 'Escrever documentação', completed: true },
      ],
      tags: ['Backend', 'API'],
    },
  ];

  isDialogOpen = false;
  dialogTask: Task | null = null;
  dialogDefaultStatus: 'todo' | 'in_progress' | 'done' = 'todo';

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

  onTaskSubmit(taskData: any): void {
    if (this.dialogTask) {
      // Update existing task
      const index = this.tasks.findIndex(t => t.id === this.dialogTask!.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.dialogTask, ...taskData };
      }
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData
      };
      this.tasks.push(newTask);
    }
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
