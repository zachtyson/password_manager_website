import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private API_URL = 'http://localhost:8000';
  constructor(private http:HttpClient) { }
  registerUser(user:any){
    return this.http.post<any>(this.API_URL+"/users",user)
  }

  getUser() {
    return this.http.get<any>(this.API_URL+"/users");
  }
}
