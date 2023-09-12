import { Component } from '@angular/core';
import {Credential} from "../../core/models/saved-credential.model";
import {User} from "../../core/models/user.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SecurityService} from "../../core/services/security/security.service";
import {Router} from "@angular/router";
import {LoginService} from "../../core/services/login/login.service";
import {AuthService} from "../../core/services/auth/auth.service";
import {CredentialsService} from "../../core/services/credentials/credentials.service";
import { MatDialog } from '@angular/material/dialog';
import { MasterPasswordDialogComponent } from '../master-password-dialog/master-password-dialog.component';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-createcredential',
  templateUrl: './createcredential.component.html',
  styleUrls: ['./createcredential.component.scss']
})
export class CreateCredentialComponent {

  isSubmittedSuccessfully: boolean = false;
  isSubmitted: boolean = false;
  credentialForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl('', [Validators.email]), // Add email control
    password: new FormControl('', Validators.required),
    nickname: new FormControl(''),
    url: new FormControl(''),
  });

  constructor(private securityService: SecurityService, private router: Router,
              private loginService: LoginService, private authService: AuthService,
              private credentialsService: CredentialsService, private dialog: MatDialog) {}
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
    console.log(this.credentialForm.value);
    // at least one field besides password must be filled out
    const formValues = this.credentialForm.value;
    if((formValues.username == undefined && formValues.email == undefined && formValues.nickname == undefined && formValues.url == undefined) || formValues.password == undefined) {
      return;
    }
    const p = formValues.password;
    const access_token = this.authService.getJwtToken();
    if(access_token == null) {
      return;
    }
    let salt: string = '';
    const dialogRef = this.dialog.open(MasterPasswordDialogComponent, {
      width: '250px',
      data: { masterPassword: '' }
    });
    let masterPassword: string = '';
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        masterPassword = result;
        this.credentialsService.getSalt(access_token).subscribe(response => {
          salt = response;
          const encryptedPassword = this.credentialsService.encrypt(p, masterPassword, salt);
          let newCredential: Credential = {
            password: encryptedPassword,
            username: formValues.username || undefined,
            email: formValues.email || undefined,
            nickname: formValues.nickname || undefined,
            url: formValues.url || undefined,
            salt: salt,
          }
          this.credentialsService.createCredential(access_token, newCredential).subscribe(response => {
            this.isSubmittedSuccessfully = true;
            this.isSubmitted = true;
          });
        });
      } else {
        console.log('You must enter the master password to continue.');
      }
    });
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
