import { WelcomeRepository } from '../interfaces/welcome.repository.interface';

export class WelcomeUseCase {
  constructor(private repository: WelcomeRepository) {}

  shouldShowWelcome(): boolean {
    return !this.repository.hasSeenWelcome();
  }

  dismissWelcome(): void {
    this.repository.markWelcomeAsSeen();
  }
}
