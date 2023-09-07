import { Component } from '@angular/core';
import {LoginService} from "../../core/services/login/login.service";
import {SecurityService} from "../../core/services/security/security.service";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private loginService: LoginService, private securityService: SecurityService,private router: Router) {
  }

  ngOnInit() {
    if(!this.loginService.checkIfUserIsLoggedIn()) {
      //if user is not logged in, redirect to login page
      this.router.navigate(['/login']);
    }
  }
}
