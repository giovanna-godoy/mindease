export interface WelcomeRepository {
  hasSeenWelcome(): boolean;
  markWelcomeAsSeen(): void;
}
