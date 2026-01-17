import { Component } from '@angular/core';
import { TasksPageComponent } from '../presentation/components/tasks-page.component';

@Component({
  standalone: true,
  imports: [TasksPageComponent],
  selector: 'app-tasks-entry',
  template: `<app-tasks-page></app-tasks-page>`,
})
export class RemoteEntry {}
