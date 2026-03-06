export type ContrastLevel = 'normal' | 'high' | 'very-high';
export type SpacingLevel = 'normal' | 'wide' | 'extra-wide';
export type FontSize = 'normal' | 'large' | 'extra-large';
export type ComplexityLevel = 'simple' | 'medium' | 'complete';
export type AnimationLevel = 'normal' | 'reduced' | 'none';

export interface AccessibilitySettings {
  contrast: ContrastLevel;
  spacing: SpacingLevel;
  fontSize: FontSize;
  complexity: ComplexityLevel;
  focusMode: boolean;
  cognitiveAlerts: boolean;
  animations: AnimationLevel;
}
