import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type SpacingLevel = 'normal' | 'wide' | 'extra-wide';

@Component({
  selector: 'app-spacing-control',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-3">
      <h3 class="font-medium text-sm">Espaçamento</h3>
      <div class="grid grid-cols-3 gap-2">
        <button
          (click)="setSpacing('normal')"
          [class]="getButtonClass('normal')"
        >
          <mat-icon class="material-icons-rounded text-sm">compress</mat-icon>
          <span class="text-xs">Normal</span>
        </button>
        <button
          (click)="setSpacing('wide')"
          [class]="getButtonClass('wide')"
        >
          <mat-icon class="material-icons-rounded text-sm">unfold_more</mat-icon>
          <span class="text-xs">Amplo</span>
        </button>
        <button
          (click)="setSpacing('extra-wide')"
          [class]="getButtonClass('extra-wide')"
        >
          <mat-icon class="material-icons-rounded text-sm">open_in_full</mat-icon>
          <span class="text-xs">Extra</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 0.75rem 0.5rem;
      border-radius: 0.5rem;
      border: 2px solid transparent;
      background-color: var(--muted);
      color: var(--muted-foreground);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    button:hover {
      background-color: var(--accent);
      color: var(--accent-foreground);
    }
    
    button.active {
      border-color: var(--primary);
      background-color: var(--primary);
      color: var(--primary-foreground);
    }
  `]
})
export class SpacingControlComponent implements OnInit {
  currentSpacing: SpacingLevel = 'normal';

  ngOnInit(): void {
    this.loadCurrentSpacing();
  }

  setSpacing(level: SpacingLevel): void {
    this.currentSpacing = level;
    if (typeof window !== 'undefined') {
      const accessibilityService = (window as any).accessibilityService;
      if (accessibilityService) {
        accessibilityService.updateSpacing(level);
      }
    }
  }

  getButtonClass(level: SpacingLevel): string {
    return this.currentSpacing === level ? 'active' : '';
  }

  private loadCurrentSpacing(): void {
    if (typeof window !== 'undefined') {
      const accessibilityService = (window as any).accessibilityService;
      if (accessibilityService) {
        this.currentSpacing = accessibilityService.getCurrentSpacing();
      } else {
        setTimeout(() => this.loadCurrentSpacing(), 100);
      }
    }
  }
}