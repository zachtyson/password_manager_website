import { Component } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {User} from "../../core/models/user.model";
import {SecurityService} from "../../core/services/security/security.service";
import {LoginService} from "../../core/services/login/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  user: User = {
    username: '',
    password: '',
    email: '',
  }
  isEmailLogin: boolean = false;
  isSubmittedSuccessfully: boolean = false;
  isSubmitted: boolean = false;
  loginForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl('', [Validators.email]), // Add email control
    password: new FormControl('', Validators.required),
  });

  constructor(private loginService: LoginService, private securityService: SecurityService,private router: Router) {

  }
  toggleEmailLogin() {
    this.isEmailLogin = !this.isEmailLogin;
    if (this.isEmailLogin) {
      this.loginForm.get('username')?.reset();
      this.loginForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.loginForm.get('username')?.clearValidators();
    } else {
      this.loginForm.get('email')?.reset();
      this.loginForm.get('username')?.setValidators(Validators.required);
      this.loginForm.get('email')?.clearValidators();
    }
    this.loginForm.get('email')?.updateValueAndValidity();
    this.loginForm.get('username')?.updateValueAndValidity();
  }
  ngOnInit() {
    if(this.loginService.checkIfUserIsLoggedIn()) {
      //if user is logged in, redirect to home page
      this.router.navigate(['/']);
    }
    this.loginForm.valueChanges.subscribe(() => {
    });
  }
  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const formValues = this.loginForm.value;
    if((formValues.username == undefined && formValues.email == undefined) || formValues.password == undefined) {
      return;
    }
    const hashedPassword = await this.securityService.hashPassword(formValues.password);
    let newUser: User = {
      password: hashedPassword,
    }

    if (this.isEmailLogin && formValues.email) {
      newUser.email = formValues.email;
    } else if (formValues.username) {
      newUser.username = formValues.username;
    }

    this.loginService.loginUser(newUser).subscribe(response => {
      this.isSubmitted = true;
      this.isSubmittedSuccessfully = true;
      response = JSON.parse(JSON.stringify(response));
      localStorage.setItem('access_token', `Bearer ${response.access_token}`);
    }, error => {
      this.isSubmittedSuccessfully = false;
      this.isSubmitted = true;
    });
  }

}
