import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutsService {
  constructor(private router: Router) {}

  init(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.altKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            this.router.navigate(['/dashboard']);
            break;
          case '2':
            e.preventDefault();
            this.router.navigate(['/tasks']);
            break;
          case '3':
            e.preventDefault();
            this.router.navigate(['/profile']);
            break;
          case '4':
            e.preventDefault();
            this.router.navigate(['/panel']);
            break;
        }
      }
    });
  }
}
