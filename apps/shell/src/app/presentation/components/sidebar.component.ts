import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() currentPage: string = 'dashboard';

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', route: '/dashboard' },
    { id: 'tasks', label: 'Tarefas', icon: 'task_alt', route: '/tasks' },
    { id: 'cognitive', label: 'Painel Cognitivo', icon: 'settings', route: '/panel' },
    { id: 'profile', label: 'Perfil', icon: 'person', route: '/profile' },
  ];

  constructor(private router: Router) {}

  navigate(pageId: string): void {
    const item = this.menuItems.find(m => m.id === pageId);
    if (item) {
      this.currentPage = pageId;
      this.router.navigate([item.route]);
    }
  }
}
