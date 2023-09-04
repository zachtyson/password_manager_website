// src/app/register/register.component.ts

import { Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { RegisterService } from '../../core/services/register/register.service';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  user: User = {
    username: '',
    email: '',
    password: '',
  }

  isSubmittedSuccessfully: boolean = false;

  constructor(private registerService: RegisterService) {}

  onSubmit(form:NgForm) {
    if(form.invalid){
      return;
    }
    this.registerService.registerUser(this.user).subscribe(response => {
      this.isSubmittedSuccessfully = true;
    }, error => {
      this.isSubmittedSuccessfully = false;
    });
  }
}
