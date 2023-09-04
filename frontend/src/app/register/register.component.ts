// src/app/register/register.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor() {}

  onSubmit() {
    // Handle the form submission, e.g., register the user
    console.log('Form submitted!');
  }
}
