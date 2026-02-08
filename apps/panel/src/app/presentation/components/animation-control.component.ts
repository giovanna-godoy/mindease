import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type AnimationLevel = 'normal' | 'reduced' | 'none';

@Component({
  selector: 'app-animation-control',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-3">
      <h3 class="font-medium text-sm">Animações</h3>
      <div class="grid grid-cols-3 gap-2">
        <button
          (click)="setAnimation('normal')"
          [class]="getButtonClass('normal')"
        >
          <mat-icon class="material-icons-rounded text-sm">flash_on</mat-icon>
          <span class="text-xs">Normal</span>
        </button>
        <button
          (click)="setAnimation('reduced')"
          [class]="getButtonClass('reduced')"
        >
          <mat-icon class="material-icons-rounded text-sm">flash_auto</mat-icon>
          <span class="text-xs">Reduzida</span>
        </button>
        <button
          (click)="setAnimation('none')"
          [class]="getButtonClass('none')"
        >
          <mat-icon class="material-icons-rounded text-sm">flash_off</mat-icon>
          <span class="text-xs">Nenhuma</span>
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
export class AnimationControlComponent implements OnInit {
  currentAnimation: AnimationLevel = 'normal';

  ngOnInit(): void {
    this.loadCurrentAnimation();
  }

  setAnimation(level: AnimationLevel): void {
    this.currentAnimation = level;
    if (typeof window !== 'undefined') {
      const accessibilityService = (window as any).accessibilityService;
      if (accessibilityService) {
        accessibilityService.updateAnimations(level);
      }
    }
  }

  getButtonClass(level: AnimationLevel): string {
    return this.currentAnimation === level ? 'active' : '';
  }

  private loadCurrentAnimation(): void {
    if (typeof window !== 'undefined') {
      const accessibilityService = (window as any).accessibilityService;
      if (accessibilityService) {
        this.currentAnimation = accessibilityService.getCurrentAnimation();
      } else {
        setTimeout(() => this.loadCurrentAnimation(), 100);
      }
    }
  }
}