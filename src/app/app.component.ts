import { Component } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';

import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly _destroying$ = new Subject<void>();
  currentUser: string | undefined;
  constructor(public authService: AuthService) {
    this.authService.currentUser.subscribe((value) => {
      this.currentUser = value;
    })
  }
  ngOnInit(): void {
    this.authService.updateLoggedInStatus();
  }
  
  login() {
    this.authService.login();
  }
  
  logout() {
    this.authService.logout();
  }

  isCollapsed = false;
}
