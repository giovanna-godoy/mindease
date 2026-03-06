import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[focusTrap]',
  standalone: true
})
export class FocusTrapDirective implements OnInit, OnDestroy {
  private focusableElements: HTMLElement[] = [];
  private firstElement?: HTMLElement;
  private lastElement?: HTMLElement;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.updateFocusableElements();
      this.firstElement?.focus();
      document.addEventListener('keydown', this.handleKeydown);
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  private updateFocusableElements(): void {
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.focusableElements = Array.from(this.el.nativeElement.querySelectorAll(selector));
    this.firstElement = this.focusableElements[0];
    this.lastElement = this.focusableElements[this.focusableElements.length - 1];
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === this.firstElement) {
        e.preventDefault();
        this.lastElement?.focus();
      }
    } else {
      if (document.activeElement === this.lastElement) {
        e.preventDefault();
        this.firstElement?.focus();
      }
    }
  };
}
