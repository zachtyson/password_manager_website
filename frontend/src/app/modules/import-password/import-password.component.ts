import { Component } from '@angular/core';
import {AuthService} from "../../core/services/auth/auth.service";
import {CredentialsService} from "../../core/services/credentials/credentials.service";
import {MasterPasswordDialogComponent} from "../master-password-dialog/master-password-dialog.component";
import {Credential} from "../../core/models/saved-credential.model";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-import-password',
  templateUrl: './import-password.component.html',
  styleUrls: ['./import-password.component.scss']
})
export class ImportPasswordComponent {

  constructor(private credentialsService: CredentialsService, private authService: AuthService, private dialog: MatDialog) {
  }
  onFileSelected(event: Event) {
    const dialogRef = this.dialog.open(MasterPasswordDialogComponent, {
      data: { masterPassword: '' }
    });
    let masterPassword: string = '';
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        masterPassword = result;
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          console.log('File selected:', file.name);
          const access_token = this.authService.getJwtToken();
          if(access_token == null) {
            console.error('User is not logged in.');
            //handle this error later
            return;
          }
          this.credentialsService.importCredentials(access_token, file,masterPassword).then((data: any) => {
            console.log(data);
          });
        }
      } else {
        return;
      }
    });
  }

}
