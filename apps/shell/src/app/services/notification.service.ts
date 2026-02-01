import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'transition';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  
  getNotifications() {
    return this.notifications$.asObservable();
  }

  showTransitionAlert(from: string, to: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'transition',
      title: 'Transição de Atividade',
      message: `Preparando transição de "${from}" para "${to}". Finalize suas anotações.`,
      duration: 5000,
      timestamp: new Date()
    };
    
    this.addNotification(notification);
  }

  showFocusBreakAlert(): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'info',
      title: 'Hora da Pausa',
      message: 'Você completou um ciclo de foco. Faça uma pausa de 5 minutos.',
      duration: 8000,
      timestamp: new Date()
    };
    
    this.addNotification(notification);
  }

  showBreakEndAlert(): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'success',
      title: 'Pausa Finalizada',
      message: 'Sua pausa terminou. Pronto para o próximo ciclo de foco?',
      duration: 6000,
      timestamp: new Date()
    };
    
    this.addNotification(notification);
  }

  private addNotification(notification: Notification): void {
    const current = this.notifications$.value;
    this.notifications$.next([...current, notification]);
    
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  removeNotification(id: string): void {
    const current = this.notifications$.value;
    this.notifications$.next(current.filter(n => n.id !== id));
  }
}