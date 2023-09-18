import { Component } from '@angular/core';
import {CredentialsService} from "../../core/services/credentials/credentials.service";
import {AuthService} from "../../core/services/auth/auth.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-export-password',
  templateUrl: './export-password.component.html',
  styleUrls: ['./export-password.component.scss']
})
export class ExportPasswordComponent {
  constructor(private credentialsService: CredentialsService, private authService: AuthService, private dialog: MatDialog) {
  }

  onExportPassword() {
    console.log('Exporting password');
  }
}
