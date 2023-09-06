import { Component } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {User} from "../../core/models/user.model";
import {SecurityService} from "../../core/services/security/security.service";
import {LoginService} from "../../core/services/login/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  user: User = {
    username: '',
    password: '',
  }
  isSubmittedSuccessfully: boolean = false;
  isSubmitted: boolean = false;
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private loginService: LoginService, private securityService: SecurityService) {

  }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginForm == null ||
        this.loginForm.get('password') == null ||
        this.loginForm.get('username') == null) {
        return;
      }
      if (!this.loginForm?.get('password')?.value ||
        !this.loginForm?.get('username')?.value) {
        return;
      }
    });
  }
  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const formValues = this.loginForm.value;
    if(formValues.username == undefined || formValues.password == undefined) {
      return;
    }
    const hashedPassword = await this.securityService.hashPassword(formValues.password);
    const newUser: User = {
      username: formValues.username,
      password: hashedPassword,
    };

    this.loginService.loginUser(newUser).subscribe(response => {
      this.isSubmitted = true;
      this.isSubmittedSuccessfully = true;
      console.log(response);
      response = JSON.parse(JSON.stringify(response));
      localStorage.setItem('access_token', `Bearer ${response.access_token}`);
    }, error => {
      this.isSubmittedSuccessfully = false;
      this.isSubmitted = true;
    });
  }

}
