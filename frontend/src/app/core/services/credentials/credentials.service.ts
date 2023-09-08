import { Injectable } from '@angular/core';
import {Credential} from "../../models/saved-credential.model";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  private API_URL = 'http://localhost:8000';

  constructor() { }

  getCredentials(access_token: string): Credential[] {
    //todo: verify access token once backend is implemented
    return [];
  }
}
