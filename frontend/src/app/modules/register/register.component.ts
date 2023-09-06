// src/app/register/register.component.ts

import { Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { RegisterService } from '../../core/services/register/register.service';
import { SecurityService} from "../../core/services/security/security.service";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";

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
  confirmPassword: string = '';
  isSubmittedSuccessfully: boolean = false;
  isSubmitted: boolean = false;
  passwordMismatch: boolean = false;
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });


  constructor(private registerService: RegisterService, private securityService: SecurityService) {

  }

  ngOnInit() {
    this.registerForm.valueChanges.subscribe(() => {
      if(this.registerForm == null) return;
      // @ts-ignore
      if(this.registerForm.get('password').value == null || this.registerForm.get('confirmPassword').value == null) {
        this.passwordMismatch = true;
      }
      // @ts-ignore
      this.passwordMismatch = this.registerForm.get('password').value !== this.registerForm.get('confirmPassword').value;
    });
  }
  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    if(this.user.password == undefined || this.user.email == undefined || this.user.username == undefined) {
      return;
    }
    if (this.user.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    } else {
      this.passwordMismatch = false;
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
