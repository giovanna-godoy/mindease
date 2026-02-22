import { CognitiveAlertsRepository } from '../interfaces/cognitive-alerts.repository.interface';

export class CognitiveAlertsUseCase {
  constructor(private repository: CognitiveAlertsRepository) {}

  enableAlerts(): void {
    this.repository.setEnabled(true);
  }

  disableAlerts(): void {
    this.repository.setEnabled(false);
  }

  toggleAlerts(): void {
    const current = this.repository.isEnabled();
    this.repository.setEnabled(!current);
  }

  isEnabled(): boolean {
    return this.repository.isEnabled();
  }

  setInterval(minutes: number): void {
    if (minutes < 1 || minutes > 120) {
      throw new Error('Intervalo deve estar entre 1 e 120 minutos');
    }
    this.repository.setInterval(minutes);
  }

  getInterval(): number {
    return this.repository.getInterval();
  }
}
