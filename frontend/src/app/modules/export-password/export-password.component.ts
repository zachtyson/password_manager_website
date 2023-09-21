import { Component } from '@angular/core';
import {CredentialsService} from "../../core/services/credentials/credentials.service";
import {AuthService} from "../../core/services/auth/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDecisionComponent} from "../confirm-decision/confirm-decision.component";
import {MasterPasswordDialogComponent} from "../master-password-dialog/master-password-dialog.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-export-password',
  templateUrl: './export-password.component.html',
  styleUrls: ['./export-password.component.scss']
})
export class ExportPasswordComponent {
  constructor(private credentialsService: CredentialsService, private authService: AuthService, private dialog: MatDialog) {
  }

  public exportFormat: string = '.csv';

  onExportPassword() {
    console.log('Exporting password');
    const dialogRef = this.dialog.open(ConfirmDecisionComponent, {
      data: { confirm: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result !== 'Yes') {
          return;
          //
        }

        const access_token = this.authService.getJwtToken();

        if(!access_token) {
          // User is not logged in. You can show an error message here if you want.
          // This shouldn't happen since they would've been redirected to the login page.
          console.error('User is not logged in');
          return;
        }

        const dialogRef2 = this.dialog.open(MasterPasswordDialogComponent, {
          data: { masterPassword: '' }
        });

        dialogRef2.afterClosed().subscribe(result => {

          const masterPassword = result;
          console.log('Master password:', masterPassword)
          // Use verifyMasterPassword to check the masterPassword
          this.credentialsService.verifyMasterPassword(access_token, masterPassword, "")
            .then(observable => {
              observable.subscribe(isVerified => {
                if (isVerified) {
                  // Master password is correct

                  this.credentialsService.getCredentials(access_token).subscribe(credentials => {
                    this.credentialsService.exportPasswords(masterPassword, credentials)
                  })
                }
                else {
                  console.error('Master password verification failed');
                  //   this.showPassword = false;
                  //   this.stringPassword = '********';
                }
              });
            })
            .catch(error => {
              console.error('Error getting the observable', error);
            });
        });
      } else {
        return;
      }
    });
  }
}
