import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [CommonModule, MatIconModule],
  templateUrl: './cognitive-panel.component.html',
})
export class CognitivePanelComponent {
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
  }

  setFontSize(value: string): void {
    this.updateSettings({ fontSize: value as 'normal' | 'large' | 'extra-large' });
  }

  setComplexity(value: string): void {
    this.updateSettings({ complexityLevel: value as 'simple' | 'medium' | 'complete' });
  }

  setAnimation(value: string): void {
    this.updateSettings({ animationLevel: value as 'normal' | 'reduced' | 'none' });
  }

  updateSettings(partial: Partial<Settings>): void {
    this.settings = { ...this.settings, ...partial };
    this.applySettings();
  }

  toggleFocusMode(): void {
    this.updateSettings({ focusMode: !this.settings.focusMode });
  }

  toggleCognitiveAlerts(): void {
    this.updateSettings({ enableCognitiveAlerts: !this.settings.enableCognitiveAlerts });
  }

  toggleDetailedView(): void {
    this.updateSettings({ showDetailedView: !this.settings.showDetailedView });
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
