import { Component } from '@angular/core';
import {Credential} from "../../core/models/saved-credential.model";
import {User} from "../../core/models/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SecurityService} from "../../core/services/security/security.service";
import {Router} from "@angular/router";
import {LoginService} from "../../core/services/login/login.service";
import {AuthService} from "../../core/services/auth/auth.service";

@Component({
  selector: 'app-createcredential',
  templateUrl: './createcredential.component.html',
  styleUrls: ['./createcredential.component.scss']
})
export class CreateCredentialComponent {

  credential: Credential = {
    username: undefined,
    encrypted_password: undefined,
    email: undefined,
    nickname: undefined,
    added_date: undefined,
    url: undefined,
  }
  isSubmittedSuccessfully: boolean = false;
  isSubmitted: boolean = false;
  credentialForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl('', [Validators.email]), // Add email control
    password: new FormControl('', Validators.required),
    nickname: new FormControl(''),
    url: new FormControl(''),
  });

  constructor(private securityService: SecurityService, private router: Router, private loginService: LoginService, private authService: AuthService) {}
  ngOnInit() {
    if(!this.loginService.checkIfUserIsLoggedIn()) {
      //if user is logged in, redirect to home page
      this.router.navigate(['/']);
    }
    this.credentialForm.valueChanges.subscribe(() => {
    });
  }
  async onSubmit() {
    if (this.credentialForm.invalid) {
      return;
    }
    // at least one field besides password must be filled out
    const formValues = this.credentialForm.value;
    if((formValues.username == undefined && formValues.email == undefined && formValues.nickname == undefined && formValues.url == undefined) || formValues.password == undefined) {
      return;
    }
    const access_token = this.authService.getJwtToken();


  }

  onEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const submitButton = document.querySelector('[mat-raised-button]');
      if (submitButton) {
        (submitButton as HTMLButtonElement).click();
      }
    }
  }

}
