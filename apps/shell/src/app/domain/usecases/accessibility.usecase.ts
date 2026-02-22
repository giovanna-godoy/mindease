import { AccessibilityRepository } from '../interfaces/accessibility.repository.interface';
import { SpacingLevel, AnimationLevel, ComplexityLevel } from '../../services/accessibility.service';

export class AccessibilityUseCase {
  constructor(private repository: AccessibilityRepository) {}

  updateSpacing(level: SpacingLevel): void {
    this.repository.saveSpacing(level);
  }

  getSpacing(): SpacingLevel {
    return this.repository.getSpacing();
  }

  updateAnimation(level: AnimationLevel): void {
    this.repository.saveAnimation(level);
  }

  getAnimation(): AnimationLevel {
    return this.repository.getAnimation();
  }

  toggleFocusMode(): void {
    const current = this.repository.getFocusMode();
    this.repository.saveFocusMode(!current);
  }

  updateFocusMode(enabled: boolean): void {
    this.repository.saveFocusMode(enabled);
  }

  getFocusMode(): boolean {
    return this.repository.getFocusMode();
  }

  toggleDetailedView(): void {
    const current = this.repository.getDetailedView();
    this.repository.saveDetailedView(!current);
  }

  updateDetailedView(enabled: boolean): void {
    this.repository.saveDetailedView(enabled);
  }

  getDetailedView(): boolean {
    return this.repository.getDetailedView();
  }

  updateComplexity(level: ComplexityLevel): void {
    this.repository.saveComplexity(level);
  }

  getComplexity(): ComplexityLevel {
    return this.repository.getComplexity();
  }
}
