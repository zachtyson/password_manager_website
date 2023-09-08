import { Component } from '@angular/core';

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
    if(localStorage.getItem('access_token')) {
      this.rightButton = '/sign-out';
      this.rightButtonText = 'Sign Out';
    } else {
      this.rightButton = '/login';
      this.rightButtonText = 'Login';
    }
  }
}
