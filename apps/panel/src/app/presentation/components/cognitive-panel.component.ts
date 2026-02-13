import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SpacingControlComponent } from './spacing-control.component';
import { AnimationControlComponent } from './animation-control.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

interface Settings {
  contrastLevel: 'normal' | 'high' | 'very-high';
  spacingLevel: 'normal' | 'wide' | 'extra-wide';
  fontSize: 'normal' | 'large' | 'extra-large';
  complexityLevel: 'simple' | 'medium' | 'complete';
  animationLevel: 'normal' | 'reduced' | 'none';
  focusMode: boolean;
  enableCognitiveAlerts: boolean;
  showDetailedView: boolean;
}

interface Option {
  value: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-cognitive-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, SpacingControlComponent, AnimationControlComponent],
  templateUrl: './cognitive-panel.component.html',
})
export class CognitivePanelComponent implements OnInit {
  settings: Settings = {
    contrastLevel: 'normal',
    spacingLevel: 'normal',
    fontSize: 'normal',
    complexityLevel: 'medium',
    animationLevel: 'normal',
    focusMode: false,
    enableCognitiveAlerts: true,
    showDetailedView: false,
  };

  private subscription?: Subscription;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSettings();
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url.includes('/panel')) {
        setTimeout(() => this.loadSettings(), 0);
      }
    });
  }

  async loadSettings(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService) {
        const user = await firebaseService.waitForUser();
        if (user) {
          try {
            const savedSettings = await firebaseService.getUserSettings(user.uid);
            if (savedSettings) {
              this.settings = { ...this.settings, ...savedSettings };
              this.applySettings();
            }
          } catch (error) {
            console.error('Error loading settings:', error);
          }
          this.cdr.detectChanges();
        }
      }
    }
  }

  contrastOptions: Option[] = [
    { value: 'normal', label: 'Normal', description: 'Contraste padrão' },
    { value: 'high', label: 'Alto', description: 'Contraste aumentado' },
    { value: 'very-high', label: 'Muito Alto', description: 'Contraste máximo' },
  ];

  spacingOptions: Option[] = [
    { value: 'normal', label: 'Normal', description: 'Espaçamento padrão' },
    { value: 'wide', label: 'Amplo', description: 'Mais espaço entre elementos' },
    { value: 'extra-wide', label: 'Extra Amplo', description: 'Máximo espaçamento' },
  ];

  fontSizeOptions: Option[] = [
    { value: 'normal', label: 'Normal', description: '16px' },
    { value: 'large', label: 'Grande', description: '18px' },
    { value: 'extra-large', label: 'Extra Grande', description: '20px' },
  ];

  complexityOptions: Option[] = [
    { value: 'simple', label: 'Simples', description: 'Somente o essencial' },
    { value: 'medium', label: 'Médio', description: 'Informações principais' },
    { value: 'complete', label: 'Completo', description: 'Todas as informações' },
  ];

  animationOptions: Option[] = [
    { value: 'normal', label: 'Normal', description: 'Animações completas' },
    { value: 'reduced', label: 'Reduzidas', description: 'Animações sutis' },
    { value: 'none', label: 'Nenhuma', description: 'Sem animações' },
  ];

  setContrast(value: string): void {
    this.updateSettings({ contrastLevel: value as 'normal' | 'high' | 'very-high' });
  }

  setSpacing(value: string): void {
    this.updateSettings({ spacingLevel: value as 'normal' | 'wide' | 'extra-wide' });
    if (typeof window !== 'undefined') {
      const accessibilityService = (window as any).accessibilityService;
      if (accessibilityService) {
        accessibilityService.updateSpacing(value as 'normal' | 'wide' | 'extra-wide');
      }
    }
  }

  setFontSize(value: string): void {
    this.updateSettings({ fontSize: value as 'normal' | 'large' | 'extra-large' });
  }

  setComplexity(value: string): void {
    this.updateSettings({ complexityLevel: value as 'simple' | 'medium' | 'complete' });
    if (typeof window !== 'undefined') {
      const accessibilityService = (window as any).accessibilityService;
      if (accessibilityService) {
        accessibilityService.updateComplexity(value as 'simple' | 'medium' | 'complete');
      }
    }
  }

  setAnimation(value: string): void {
    this.updateSettings({ animationLevel: value as 'normal' | 'reduced' | 'none' });
    if (typeof window !== 'undefined') {
      const accessibilityService = (window as any).accessibilityService;
      if (accessibilityService) {
        accessibilityService.updateAnimations(value as 'normal' | 'reduced' | 'none');
      }
    }
  }

  updateSettings(partial: Partial<Settings>): void {
    this.settings = { ...this.settings, ...partial };
    this.applySettings();
    this.saveSettings();
    this.showSuccessMessage();
  }

  async saveSettings(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService) {
        const user = await firebaseService.waitForUser();
        if (user) {
          try {
            await firebaseService.saveSettings(user.uid, this.settings);
          } catch (error) {
            console.error('Error saving settings:', error);
          }
        }
      }
    }
  }

  toggleFocusMode(): void {
    this.updateSettings({ focusMode: !this.settings.focusMode });
    if (typeof window !== 'undefined') {
      const accessibilityService = (window as any).accessibilityService;
      if (accessibilityService) {
        accessibilityService.updateFocusMode(!this.settings.focusMode);
      }
    }
  }

  toggleCognitiveAlerts(): void {
    this.updateSettings({ enableCognitiveAlerts: !this.settings.enableCognitiveAlerts });
    if (typeof window !== 'undefined') {
      const cognitiveAlertsService = (window as any).cognitiveAlertsService;
      if (cognitiveAlertsService) {
        cognitiveAlertsService.setEnabled(!this.settings.enableCognitiveAlerts);
      }
    }
  }

  toggleDetailedView(): void {
    this.updateSettings({ showDetailedView: !this.settings.showDetailedView });
    if (typeof window !== 'undefined') {
      const accessibilityService = (window as any).accessibilityService;
      if (accessibilityService) {
        accessibilityService.updateDetailedView(!this.settings.showDetailedView);
      }
    }
  }

  resetSettings(): void {
    this.settings = {
      contrastLevel: 'normal',
      spacingLevel: 'normal',
      fontSize: 'normal',
      complexityLevel: 'medium',
      animationLevel: 'normal',
      focusMode: false,
      enableCognitiveAlerts: true,
      showDetailedView: false,
    };
    this.applySettings();
    this.showSuccessMessage('Configurações resetadas com sucesso!');
  }

  private showSuccessMessage(message: string = 'Configurações salvas com sucesso!'): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: message,
          duration: 3000
        }
      });
      window.dispatchEvent(event);
    }
  }

  private applySettings(): void {
    const root = document.documentElement;
    
    root.classList.remove('high-contrast', 'very-high-contrast');
    if (this.settings.contrastLevel === 'high') {
      root.classList.add('high-contrast');
    } else if (this.settings.contrastLevel === 'very-high') {
      root.classList.add('very-high-contrast');
    }

    root.classList.remove('wide-spacing', 'extra-wide-spacing');
    if (this.settings.spacingLevel === 'wide') {
      root.classList.add('wide-spacing');
    } else if (this.settings.spacingLevel === 'extra-wide') {
      root.classList.add('extra-wide-spacing');
    }

    root.classList.remove('large-text', 'extra-large-text');
    if (this.settings.fontSize === 'large') {
      root.classList.add('large-text');
    } else if (this.settings.fontSize === 'extra-large') {
      root.classList.add('extra-large-text');
    }

    root.classList.remove('reduced-motion', 'no-animations');
    if (this.settings.animationLevel === 'reduced') {
      root.classList.add('reduced-motion');
    } else if (this.settings.animationLevel === 'none') {
      root.classList.add('no-animations');
    }

    if (this.settings.focusMode) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }
  }
}
