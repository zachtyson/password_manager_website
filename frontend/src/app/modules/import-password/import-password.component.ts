import { Component } from '@angular/core';
import {AuthService} from "../../core/services/auth/auth.service";
import {CredentialsService} from "../../core/services/credentials/credentials.service";

@Component({
  selector: 'app-import-password',
  templateUrl: './import-password.component.html',
  styleUrls: ['./import-password.component.scss']
})
export class ImportPasswordComponent {

  constructor(private credentialsService: CredentialsService, private authService: AuthService) {
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const fileName = fileInput.name.toLowerCase();
    if (!fileName.endsWith('.csv')) {
      console.error('Selected file is not a CSV.');
      return;
    }
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      console.log('File selected:', file.name);

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        const csvContent = reader.result as string;

        // Process and parse the CSV content here
      };

      reader.onerror = (error) => {
        console.error('Error reading the file:', error);
      };
    }
  }
}
