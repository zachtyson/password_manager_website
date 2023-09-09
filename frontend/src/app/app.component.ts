import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

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
  }


  constructor(private router: Router) {
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
