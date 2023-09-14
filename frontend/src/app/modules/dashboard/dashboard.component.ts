import { Component } from '@angular/core';
import {LoginService} from "../../core/services/login/login.service";
import {SecurityService} from "../../core/services/security/security.service";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CredentialsService} from "../../core/services/credentials/credentials.service";
import {Credential} from "../../core/models/saved-credential.model";
import {AuthService} from "../../core/services/auth/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private loginService: LoginService, private securityService: SecurityService,
              private router: Router, private credentialsService: CredentialsService,
              private authService: AuthService) {
  }

  ngOnInit() {
    if(!this.loginService.checkIfUserIsLoggedIn()) {
      //if user is not logged in, redirect to login page
      this.router.navigate(['/login']);
    }
    const token = this.authService.getJwtToken();
    if(token != null) {
      this.credentialsService.getCredentials(token).subscribe((data: Credential[]) => {
        this.savedCredentials = data;
        for(let i = 0; i < this.savedCredentials.length; i++) {
          this.stringifiedCredentials.push(JSON.stringify(this.savedCredentials[i]));
        }
      }, error => {
        console.log(error);
      });
    }
  }
  savedCredentials:Credential[] = [];
  stringifiedCredentials:string[] = [];
}
