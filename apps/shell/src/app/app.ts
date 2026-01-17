import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WelcomeDialogComponent } from './presentation/components/welcome-dialog.component';
import { SidebarComponent } from './presentation/components/sidebar.component';

@Component({
  imports: [RouterModule, CommonModule, WelcomeDialogComponent, SidebarComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'shell';
}
