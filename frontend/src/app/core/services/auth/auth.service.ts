import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  clearLocalStorage(): boolean {
    try {
      localStorage.clear();
      return Object.keys(localStorage).length === 0;
    } catch (error) {
      console.error('Failed to clear local storage:', error);
      return false;
    }
  }

  decodeJwtToken(token: string): any {
    try {
      const payloadPart = token.split('.')[1];
      const payloadString = atob(payloadPart);
      return JSON.parse(payloadString);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }
}
