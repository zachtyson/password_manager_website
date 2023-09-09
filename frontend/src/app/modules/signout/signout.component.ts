import { Component } from '@angular/core';
import {AuthService} from "../../core/services/auth/auth.service";

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent {
  constructor(private authService: AuthService) {}

  successfulClearLocalStorage: boolean|null = false;
  ngOnInit() {
    this.successfulClearLocalStorage = this.authService.clearLocalStorage();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  }
}
