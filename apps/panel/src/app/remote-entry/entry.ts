import { Component } from '@angular/core';
import { CognitivePanelComponent } from '../presentation/components/cognitive-panel.component';

@Component({
  imports: [CognitivePanelComponent],
  selector: 'app-panel-entry',
  template: `<app-cognitive-panel></app-cognitive-panel>`,
})
export class RemoteEntry {}
