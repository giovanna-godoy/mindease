export interface CognitiveAlertsRepository {
  isEnabled(): boolean;
  setEnabled(enabled: boolean): void;
  getInterval(): number;
  setInterval(minutes: number): void;
}
