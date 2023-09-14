import {Component, SimpleChanges} from '@angular/core';
import {LoginService} from "../../core/services/login/login.service";
import {SecurityService} from "../../core/services/security/security.service";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CredentialsService} from "../../core/services/credentials/credentials.service";
import {Credential} from "../../core/models/saved-credential.model";
import {AuthService} from "../../core/services/auth/auth.service";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";

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

  searchTerm = new FormControl('');

  ngOnInit() {
    this.searchTerm.valueChanges.pipe(
      debounceTime(300),          // wait for a 300ms pause in typing
      distinctUntilChanged()      // only if the new value is different from the last
    ).subscribe(term => {
      this.filterCredentials("");
    });

    if(!this.loginService.checkIfUserIsLoggedIn()) {
      //if user is not logged in, redirect to login page
      this.router.navigate(['/login']);
    }
    const token = this.authService.getJwtToken();
    if(token != null) {
      this.credentialsService.getCredentials(token).subscribe((data: Credential[]) => {
        this.savedCredentials = data;
        this.filteredCredentials = this.savedCredentials;
        for(let i = 0; i < this.savedCredentials.length; i++) {
          this.stringifiedCredentials.push(JSON.stringify(this.savedCredentials[i]));
        }
      }, error => {
        console.log(error);
      });
    }
  }

  filteredCredentials: Credential[] = [];

  filterCredentials(term:string) {

  }

  ngOnChanges(changes: SimpleChanges) {
    let s:string|null;
    try {
      s = this.searchTerm.value;
    }
    catch (e) {
      return;
    }
    if(s == null) {
      return;
    }
    this.filterCredentials(s);
  }

  savedCredentials:Credential[] = [];
  stringifiedCredentials:string[] = [];
}
