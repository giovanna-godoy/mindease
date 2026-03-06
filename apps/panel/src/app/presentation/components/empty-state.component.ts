import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
      <mat-icon 
        class="material-icons-rounded mb-4" 
        [style.fontSize.px]="48"
        [style.width.px]="48"
        [style.height.px]="48"
        [style.color]="'var(--muted-foreground)'"
        aria-hidden="true"
      >
        {{ icon }}
      </mat-icon>
      <h3 class="font-semibold text-lg mb-2" [style.color]="'var(--card-foreground)'">
        {{ title }}
      </h3>
      <p class="text-sm mb-4" [style.color]="'var(--muted-foreground)'">
        {{ description }}
      </p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Nenhum item encontrado';
  @Input() description = 'Comece adicionando um novo item';
}
