import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SpacingLevel = 'normal' | 'wide' | 'extra-wide';
export type AnimationLevel = 'normal' | 'reduced' | 'none';
export type ComplexityLevel = 'simple' | 'medium' | 'complete';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private renderer: Renderer2;
  private spacingSubject = new BehaviorSubject<SpacingLevel>('normal');
  public spacing$ = this.spacingSubject.asObservable();
  
  private animationSubject = new BehaviorSubject<AnimationLevel>('normal');
  public animation$ = this.animationSubject.asObservable();
  
  private focusModeSubject = new BehaviorSubject<boolean>(false);
  public focusMode$ = this.focusModeSubject.asObservable();
  
  private detailedViewSubject = new BehaviorSubject<boolean>(false);
  public detailedView$ = this.detailedViewSubject.asObservable();
  
  private complexitySubject = new BehaviorSubject<ComplexityLevel>('medium');
  public complexity$ = this.complexitySubject.asObservable();

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.loadSpacingLevel();
    this.loadAnimationLevel();
    this.loadFocusMode();
    this.loadDetailedView();
    this.loadComplexity();
  }

  updateSpacing(level: SpacingLevel): void {
    this.spacingSubject.next(level);
    this.saveSpacingLevel(level);
    this.applySpacingClass(level);
  }

  private loadSpacingLevel(): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const saved = settings?.spacingLevel as SpacingLevel;
          if (saved && ['normal', 'wide', 'extra-wide'].includes(saved)) {
            this.spacingSubject.next(saved);
            this.applySpacingClass(saved);
          }
        }).catch(() => {
          const saved = localStorage.getItem('app-spacing-level') as SpacingLevel;
          if (saved && ['normal', 'wide', 'extra-wide'].includes(saved)) {
            this.spacingSubject.next(saved);
            this.applySpacingClass(saved);
          }
        });
      } else {
        setTimeout(() => this.loadSpacingLevel(), 500);
      }
    }
  }

  private saveSpacingLevel(level: SpacingLevel): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const updatedSettings = { ...settings, spacingLevel: level };
          return firebaseService.saveSettings(user.uid, updatedSettings);
        }).catch(() => {
          localStorage.setItem('app-spacing-level', level);
        });
      } else {
        localStorage.setItem('app-spacing-level', level);
      }
    }
  }

  private applySpacingClass(level: SpacingLevel): void {
    if (typeof document !== 'undefined') {
      this.renderer.removeClass(document.body, 'wide-spacing');
      this.renderer.removeClass(document.body, 'extra-wide-spacing');
      
      if (level === 'wide') {
        this.renderer.addClass(document.body, 'wide-spacing');
      } else if (level === 'extra-wide') {
        this.renderer.addClass(document.body, 'extra-wide-spacing');
      }
    }
  }

  getCurrentSpacing(): SpacingLevel {
    return this.spacingSubject.value;
  }

  updateAnimations(level: AnimationLevel): void {
    this.animationSubject.next(level);
    this.saveAnimationLevel(level);
    this.applyAnimationClass(level);
  }

  private loadAnimationLevel(): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const saved = settings?.animationLevel as AnimationLevel;
          if (saved && ['normal', 'reduced', 'none'].includes(saved)) {
            this.animationSubject.next(saved);
            this.applyAnimationClass(saved);
          }
        }).catch(() => {
          const saved = localStorage.getItem('app-animation-level') as AnimationLevel;
          if (saved && ['normal', 'reduced', 'none'].includes(saved)) {
            this.animationSubject.next(saved);
            this.applyAnimationClass(saved);
          }
        });
      } else {
        setTimeout(() => this.loadAnimationLevel(), 500);
      }
    }
  }

  private saveAnimationLevel(level: AnimationLevel): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const updatedSettings = { ...settings, animationLevel: level };
          return firebaseService.saveSettings(user.uid, updatedSettings);
        }).catch(() => {
          localStorage.setItem('app-animation-level', level);
        });
      } else {
        localStorage.setItem('app-animation-level', level);
      }
    }
  }

  private applyAnimationClass(level: AnimationLevel): void {
    if (typeof document !== 'undefined') {
      this.renderer.removeClass(document.body, 'reduced-motion');
      this.renderer.removeClass(document.body, 'no-animations');
      
      if (level === 'reduced') {
        this.renderer.addClass(document.body, 'reduced-motion');
      } else if (level === 'none') {
        this.renderer.addClass(document.body, 'no-animations');
      }
    }
  }

  getCurrentAnimation(): AnimationLevel {
    return this.animationSubject.value;
  }

  updateFocusMode(enabled: boolean): void {
    this.focusModeSubject.next(enabled);
    this.saveFocusMode(enabled);
    this.applyFocusMode(enabled);
  }

  private loadFocusMode(): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const enabled = settings?.focusMode === true;
          this.focusModeSubject.next(enabled);
          this.applyFocusMode(enabled);
        }).catch(() => {
          const saved = localStorage.getItem('app-focus-mode');
          const enabled = saved === 'true';
          this.focusModeSubject.next(enabled);
          this.applyFocusMode(enabled);
        });
      } else {
        setTimeout(() => this.loadFocusMode(), 500);
      }
    }
  }

  private saveFocusMode(enabled: boolean): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const updatedSettings = { ...settings, focusMode: enabled };
          return firebaseService.saveSettings(user.uid, updatedSettings);
        }).catch(() => {
          localStorage.setItem('app-focus-mode', enabled.toString());
        });
      } else {
        localStorage.setItem('app-focus-mode', enabled.toString());
      }
    }
  }

  private applyFocusMode(enabled: boolean): void {
    if (typeof document !== 'undefined') {
      if (enabled) {
        this.renderer.addClass(document.body, 'focus-mode');
      } else {
        this.renderer.removeClass(document.body, 'focus-mode');
      }
    }
  }

  getCurrentFocusMode(): boolean {
    return this.focusModeSubject.value;
  }

  updateDetailedView(enabled: boolean): void {
    this.detailedViewSubject.next(enabled);
    this.saveDetailedView(enabled);
    this.applyDetailedView(enabled);
  }

  private loadDetailedView(): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const enabled = settings?.detailedView === true;
          this.detailedViewSubject.next(enabled);
          this.applyDetailedView(enabled);
        }).catch(() => {
          const saved = localStorage.getItem('app-detailed-view');
          const enabled = saved === 'true';
          this.detailedViewSubject.next(enabled);
          this.applyDetailedView(enabled);
        });
      } else {
        setTimeout(() => this.loadDetailedView(), 500);
      }
    }
  }

  private saveDetailedView(enabled: boolean): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const updatedSettings = { ...settings, detailedView: enabled };
          return firebaseService.saveSettings(user.uid, updatedSettings);
        }).catch(() => {
          localStorage.setItem('app-detailed-view', enabled.toString());
        });
      } else {
        localStorage.setItem('app-detailed-view', enabled.toString());
      }
    }
  }

  private applyDetailedView(enabled: boolean): void {
    if (typeof document !== 'undefined') {
      if (enabled) {
        this.renderer.addClass(document.body, 'detailed-view');
      } else {
        this.renderer.removeClass(document.body, 'detailed-view');
      }
    }
  }

  getCurrentDetailedView(): boolean {
    return this.detailedViewSubject.value;
  }

  updateComplexity(level: ComplexityLevel): void {
    this.complexitySubject.next(level);
    this.saveComplexity(level);
    this.applyComplexity(level);
  }

  private loadComplexity(): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const saved = settings?.complexityLevel as ComplexityLevel;
          if (saved && ['simple', 'medium', 'complete'].includes(saved)) {
            this.complexitySubject.next(saved);
            this.applyComplexity(saved);
          }
        }).catch(() => {
          const saved = localStorage.getItem('app-complexity-level') as ComplexityLevel;
          if (saved && ['simple', 'medium', 'complete'].includes(saved)) {
            this.complexitySubject.next(saved);
            this.applyComplexity(saved);
          }
        });
      } else {
        setTimeout(() => this.loadComplexity(), 500);
      }
    }
  }

  private saveComplexity(level: ComplexityLevel): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const updatedSettings = { ...settings, complexityLevel: level };
          return firebaseService.saveSettings(user.uid, updatedSettings);
        }).catch(() => {
          localStorage.setItem('app-complexity-level', level);
        });
      } else {
        localStorage.setItem('app-complexity-level', level);
      }
    }
  }

  private applyComplexity(level: ComplexityLevel): void {
    if (typeof document !== 'undefined') {
      this.renderer.removeClass(document.body, 'simple-ui');
      this.renderer.removeClass(document.body, 'complete-ui');
      
      if (level === 'simple') {
        this.renderer.addClass(document.body, 'simple-ui');
      } else if (level === 'complete') {
        this.renderer.addClass(document.body, 'complete-ui');
      }
    }
  }

  getCurrentComplexity(): ComplexityLevel {
    return this.complexitySubject.value;
  }
}