import { Component } from '@angular/core';
import { DashboardComponent } from '../presentation/components/dashboard.component';

@Component({
  standalone: true,
  imports: [DashboardComponent],
  selector: 'app-dashboard-entry',
  template: `<app-dashboard></app-dashboard>`,
})
export class RemoteEntry {}