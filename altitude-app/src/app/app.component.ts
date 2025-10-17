import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketConnectionService } from './services/socket-connection.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'altitude-app';

  // Inject socket service to establish connection on app initialization


  constructor() {
  }
}
