import {Component, Input} from '@angular/core';
import {Credential} from "../../core/models/saved-credential.model";
import {MasterPasswordDialogComponent} from "../master-password-dialog/master-password-dialog.component";
import {SecurityService} from "../../core/services/security/security.service";
import {Router} from "@angular/router";
import {LoginService} from "../../core/services/login/login.service";
import {AuthService} from "../../core/services/auth/auth.service";
import {CredentialsService} from "../../core/services/credentials/credentials.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-credential-card',
  templateUrl: './credential-card.component.html',
  styleUrls: ['./credential-card.component.scss']
})
export class CredentialCardComponent {
  @Input() data?: Credential;

  showPassword = false;

  constructor(private securityService: SecurityService, private router: Router,
              private loginService: LoginService, private authService: AuthService,
              private credentialsService: CredentialsService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const dialogRef = this.dialog.open(MasterPasswordDialogComponent, {
      data: { masterPassword: '' }
    });


    if(!this.data?.salt || !this.data?.encrypted_password) {
      return;
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const masterPassword = result;
        const salt = this.data?.salt;
        const encryptedPassword = this.data?.encrypted_password;
        const credential_id = this.data?.id;  // Assuming your data has an id property for the credential ID.

        if (!salt || !encryptedPassword || !credential_id) {
          return;
        }

        const access_token = this.authService.getJwtToken();

        if(!access_token) {
          // User is not logged in. You can show an error message here if you want.
          // This shouldn't happen since they would've been redirected to the login page.
          console.error('User is not logged in');
          this.showPassword = false;
          return;
        }
        // Use verifyMasterPassword to check the masterPassword
        this.credentialsService.verifyMasterPassword(access_token, masterPassword, credential_id.toString())
          .then(observable => {
            observable.subscribe(isVerified => {
              if (isVerified) {
                const decryptedPassword = this.credentialsService.decrypt(encryptedPassword, masterPassword, salt);
                if (!decryptedPassword) {
                  console.error('Decryption failed');
                  this.showPassword = false;
                  return;
                }
                if (!this.data) {
                  console.error('Credential data is null');
                  return;
                }
                this.data.encrypted_password = decryptedPassword;
                this.showPassword = true;
              } else {
                console.error('Master password verification failed');
                this.showPassword = false;
              }
            });
          })
          .catch(error => {
            console.error('Error getting the observable', error);
          });

      } else {
        return;
      }
    });
  }

}
