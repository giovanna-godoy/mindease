import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="rounded-lg p-4 h-full flex flex-col" [style.backgroundColor]="'var(--card)'" [style.borderColor]="'var(--border)'" style="border: 1px solid">
      <!-- Simples: apenas ícone e valor -->
      <div class="simple-ui-content flex-1 flex items-center justify-center">
        <div class="flex items-center justify-center gap-3">
          <mat-icon class="material-icons-rounded" [style.color]="valueColor || 'var(--primary)'" style="font-size: 48px; width: 48px; height: 48px;">{{ icon }}</mat-icon>
          <div class="text-4xl font-bold" [style.color]="valueColor || 'var(--card-foreground)'">{{ value }}</div>
        </div>
      </div>
      
      <!-- Médio: título e valor -->
      <div class="medium-ui-content flex-1 flex flex-col">
        <div class="flex items-center gap-2 text-sm mb-2" [style.color]="'var(--muted-foreground)'">
          <mat-icon class="material-icons-rounded" style="font-size: 20px; width: 20px; height: 20px;">{{ icon }}</mat-icon>
          {{ title }}
        </div>
        <div class="text-3xl font-bold" [style.color]="valueColor || 'var(--card-foreground)'">{{ value }}</div>
      </div>
      
      <!-- Completo: tudo -->
      <div class="complete-ui-content flex-1 flex flex-col">
        <div class="pb-3">
          <div class="flex items-center gap-2 text-sm" [style.color]="'var(--muted-foreground)'">
            <mat-icon class="material-icons-rounded" style="font-size: 20px; width: 20px; height: 20px;">{{ icon }}</mat-icon>
            {{ title }}
          </div>
          <div class="text-3xl font-bold mt-2" [style.color]="valueColor || 'var(--card-foreground)'">{{ value }}</div>
        </div>
        <div *ngIf="description" class="text-sm" [style.color]="'var(--muted-foreground)'">
          {{ description }}
        </div>
        <div *ngIf="showProgress" class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div class="h-2 rounded-full" [style.backgroundColor]="'var(--accent)'" [style.width.%]="progressValue"></div>
        </div>
      </div>
    </div>
  `,
})
export class StatsCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() icon!: string;
  @Input() description?: string;
  @Input() valueColor?: string;
  @Input() showProgress = false;
  @Input() progressValue = 0;
}