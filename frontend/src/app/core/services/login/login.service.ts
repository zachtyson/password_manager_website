import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private API_URL = 'http://localhost:8000';
  constructor(private http:HttpClient) { }

  loginUser(user: User){
    const formData: FormData = new FormData();
    let loginUrl = this.API_URL+"/login";
    if (user.username && user.password) {
      formData.append('username', user.username);
      formData.append('password', user.password);
      loginUrl = loginUrl + "/u";
    } else if (user.email && user.password) {
      formData.append('email', user.email);
      formData.append('password', user.password);
      loginUrl = loginUrl + "/e";
    } else {
      throw new Error('Invalid user object. Must contain either username or email along with a password.');
    }
    return this.http.post<any>(loginUrl,formData)
  }

  checkIfUserIsLoggedIn():boolean{
    const token = localStorage.getItem('access_token');
    //todo: check if token is valid and not expired
    //can't do this until an api endpoint is created to check if token is valid
    //todo: move to auth service
    if(token == null) {
      return false;
    }
    return true;
  }
}
