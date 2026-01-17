import { Component } from '@angular/core';
import { UserProfileComponent } from '../presentation/components/user-profile.component';

@Component({
  standalone: true,
  imports: [UserProfileComponent],
  selector: 'app-profile-entry',
  template: `
    <div>
      <app-user-profile></app-user-profile>
    </div>
  `,
})
export class RemoteEntry {}
