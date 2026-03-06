import { FirebaseService } from '../services/firebase.service';
import { AccessibilityService } from '../services/accessibility.service';
import { CognitiveAlertsService } from '../services/cognitive-alerts.service';

export interface MindEaseWindow extends Window {
  firebaseService?: FirebaseService;
  accessibilityService?: AccessibilityService;
  cognitiveAlertsService?: CognitiveAlertsService;
}

declare global {
  interface Window {
    firebaseService?: any;
    accessibilityService?: any;
    cognitiveAlertsService?: any;
  }
}
