import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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

interface TaskFormData {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'Baixa' | 'Média' | 'Alta';
  estimatedTime: number;
  tags: string[];
  subtasks: Subtask[];
}

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.css'
})
export class TaskFormDialogComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() task: Task | null = null;
  @Input() defaultStatus: 'todo' | 'in_progress' | 'done' = 'todo';
  
  @Output() openChange = new EventEmitter<boolean>();
  @Output() taskSubmit = new EventEmitter<TaskFormData>();

  formData: TaskFormData = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'Média',
    estimatedTime: 0,
    tags: [],
    subtasks: []
  };

  newTag = '';
  newSubtask = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] || changes['defaultStatus'] || changes['isOpen']) {
      this.resetForm();
    }
  }

  private resetForm(): void {
    if (this.task) {
      this.formData = {
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        priority: this.task.priority,
        estimatedTime: this.task.estimatedTime,
        tags: [...this.task.tags],
        subtasks: [...this.task.subtasks]
      };
    } else {
      this.formData = {
        title: '',
        description: '',
        status: this.defaultStatus,
        priority: 'Média',
        estimatedTime: 0,
        tags: [],
        subtasks: []
      };
    }
    this.newTag = '';
    this.newSubtask = '';
  }

  onSubmit(): void {
    if (!this.formData.title.trim()) return;

    this.taskSubmit.emit({
      ...this.formData,
      title: this.formData.title.trim(),
      description: this.formData.description.trim()
    });

    this.closeDialog();
  }

  addTag(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    if (this.newTag.trim() && !this.formData.tags.includes(this.newTag.trim())) {
      this.formData.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(tagToRemove: string): void {
    this.formData.tags = this.formData.tags.filter(tag => tag !== tagToRemove);
  }

  addSubtask(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.newSubtask.trim() && this.task) {
      const newSubtaskObj: Subtask = {
        id: Date.now().toString(),
        title: this.newSubtask.trim(),
        completed: false
      };
      this.formData.subtasks.push(newSubtaskObj);
      this.newSubtask = '';
    }
  }

  closeDialog(): void {
    this.openChange.emit(false);
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeDialog();
    }
  }
}