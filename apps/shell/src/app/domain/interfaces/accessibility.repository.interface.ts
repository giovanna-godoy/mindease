import { SpacingLevel, AnimationLevel, ComplexityLevel } from '../../services/accessibility.service';

export interface AccessibilityRepository {
  getSpacing(): SpacingLevel;
  saveSpacing(level: SpacingLevel): void;
  getAnimation(): AnimationLevel;
  saveAnimation(level: AnimationLevel): void;
  getFocusMode(): boolean;
  saveFocusMode(enabled: boolean): void;
  getDetailedView(): boolean;
  saveDetailedView(enabled: boolean): void;
  getComplexity(): ComplexityLevel;
  saveComplexity(level: ComplexityLevel): void;
}
