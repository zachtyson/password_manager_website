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
}
