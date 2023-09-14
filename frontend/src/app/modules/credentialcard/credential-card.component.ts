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
    console.log(this.data);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const dialogRef = this.dialog.open(MasterPasswordDialogComponent, {
      data: { masterPassword: '' }
    });
    let masterPassword: string = '';
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        masterPassword = result;
        console.log(masterPassword);
        const salt = this.data?.salt;
        if(salt == undefined) {
          return;
        }
        const encryptedPassword = this.data?.encrypted_password;
        if(encryptedPassword == undefined) {
          return;
        }
        const decryptedPassword = this.credentialsService.decrypt(encryptedPassword, masterPassword, salt);
        console.log(decryptedPassword);
        if(this.data == undefined) {
          return;
        }
        this.showPassword = true;
        this.data.encrypted_password = decryptedPassword;
      } else {
        return;
      }
    });
  }
}
