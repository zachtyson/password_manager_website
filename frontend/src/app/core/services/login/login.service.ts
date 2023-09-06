import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private API_URL = 'http://localhost:8000';
  constructor(private http:HttpClient) { }

  loginUser(user:any){
    const formData: FormData = new FormData();
    for (const key in user) {
      if (user.hasOwnProperty(key)) {
        formData.append(key, user[key]);
      }
    }
    return this.http.post<any>(this.API_URL+"/login",formData)
  }

  checkIfUserIsLoggedIn():boolean{
    const token = localStorage.getItem('access_token');
    //todo: check if token is valid and not expired
    //can't do this until an api endpoint is created to check if token is valid
    if(token == null) {
      return false;
    }
    return true;
  }
}
