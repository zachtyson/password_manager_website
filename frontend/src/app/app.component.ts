import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "./core/services/auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  rightButton = '/login';
  rightButtonText = 'Login';
  ngOnInit() {
    this.updateRightButton();
    if(this.authService.checkTokenExpiry()) {
      this.authService.clearLocalStorage();
      this.router.navigate(['/login']);
    }
  }


  constructor(private router: Router, private authService: AuthService) {
    // Subscribe to the NavigationEnd event
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateRightButton();
      }
    });
  }

  private updateRightButton() {
    if (localStorage.getItem('access_token')) {
      this.rightButton = '/signout';
      this.rightButtonText = 'Sign Out';
    } else {
      this.rightButton = '/login';
      this.rightButtonText = 'Login';
    }
  }

}
