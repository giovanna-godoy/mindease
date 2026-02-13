import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

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
export class SidebarComponent implements OnInit {
  @Input() currentPage: string = 'dashboard';
  isMobileMenuOpen = false;

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', route: '/dashboard' },
    { id: 'tasks', label: 'Tarefas', icon: 'task_alt', route: '/tasks' },
    { id: 'cognitive', label: 'Painel Cognitivo', icon: 'settings', route: '/panel' },
    { id: 'profile', label: 'Perfil', icon: 'person', route: '/profile' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Atualiza currentPage baseado na rota atual
    this.updateCurrentPageFromRoute(this.router.url);
    
    // Escuta mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentPageFromRoute(event.url);
      });
  }

  private updateCurrentPageFromRoute(url: string): void {
    const route = url.split('/')[1] || 'dashboard';
    const menuItem = this.menuItems.find(item => item.route.includes(route));
    if (menuItem) {
      this.currentPage = menuItem.id;
    }
  }

  navigate(pageId: string): void {
    const item = this.menuItems.find(m => m.id === pageId);
    if (item) {
      this.currentPage = pageId;
      this.router.navigate([item.route]);
      this.isMobileMenuOpen = false; // Fecha o menu após navegação
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erro ao fazer logout:', error);
      }
    });
  }
}
