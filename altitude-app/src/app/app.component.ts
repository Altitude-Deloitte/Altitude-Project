import { Component, inject, OnInit, Injector } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SocketConnectionService } from './services/socket-connection.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'altitude-app';

  // Inject dependencies in the constructor/field initializer context
  private router = inject(Router);
  private injector = inject(Injector);
  private socketConnection?: SocketConnectionService;

  constructor() {
    console.log('Application initialized');
  }

  ngOnInit() {
    // Listen for navigation events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Only establish socket connection after user logs in (not on login page)
      if (!event.url.includes('/login') && !this.socketConnection) {
        console.log('User navigated away from login - Establishing socket connection');
        // Use injector.get() instead of inject() in async context
        this.socketConnection = this.injector.get(SocketConnectionService);
      }
    });

    // Check initial route - if not on login page, connect socket
    if (!this.router.url.includes('/login') && this.router.url !== '/') {
      console.log('Not on login page - Establishing socket connection');
      // Use injector.get() instead of inject() outside constructor
      this.socketConnection = this.injector.get(SocketConnectionService);
    }
  }
}
