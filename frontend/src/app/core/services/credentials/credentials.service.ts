import { Injectable } from '@angular/core';
import {Credential} from "../../models/saved-credential.model";
import {User} from "../../models/user.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  private API_URL = 'http://localhost:8000';

  constructor(private http:HttpClient) { }

  getCredentials(access_token: string): Observable<Credential[]> {
    // todo: verify access token once backend is implemented
    const path = '/stored_credentials/username';
    const headers = new HttpHeaders({
      'Authorization': access_token,
    });
    const options = { headers: headers };
    return this.http.get<Credential[]>(this.API_URL + path, options);
  }

  getSalt(access_token: string): Observable<string> {
    const path = '/stored_credentials/get_salt';
    const headers = new HttpHeaders({
      'Authorization': access_token,
    });
    const options = { headers: headers };
    return this.http.get<string>(this.API_URL + path, options);
  }
}
