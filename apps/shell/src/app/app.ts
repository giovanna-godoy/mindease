import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomeDialogComponent } from './presentation/components/welcome-dialog.component';

@Component({
  imports: [RouterModule, WelcomeDialogComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'shell';
}
