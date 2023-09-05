// src/app/register/register.component.ts

import { Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { RegisterService } from '../../core/services/register/register.service';
import { SecurityService} from "../../core/services/security/security.service";
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
  isSubmitted: boolean = false;

  constructor(private registerService: RegisterService, private securityService: SecurityService) {}

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if(this.user.password == undefined || this.user.email == undefined || this.user.username == undefined) {
      return;
    }
    let p = await this.securityService.hashPassword(this.user.password);
    const newUser: User = {
      username: this.user.username,
      email: this.user.email,
      password: p
    }
    this.user.password = await this.securityService.hashPassword(this.user.password);
    this.registerService.registerUser(newUser).subscribe(response => {
      this.isSubmitted = true;
      this.isSubmittedSuccessfully = true;
    }, error => {
      this.isSubmittedSuccessfully = false;
      this.isSubmitted = true;
    });
  }
}
