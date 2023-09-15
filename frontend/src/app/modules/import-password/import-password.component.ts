import { Component } from '@angular/core';

@Component({
  selector: 'app-import-password',
  templateUrl: './import-password.component.html',
  styleUrls: ['./import-password.component.scss']
})
export class ImportPasswordComponent {
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      console.log('File selected:', file.name);

      // Process your file here (e.g., read it, parse it, etc.)
    }
  }
}
