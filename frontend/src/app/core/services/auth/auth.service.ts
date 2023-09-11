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

  checkTokenExpiry(): boolean {
    const token = localStorage.getItem('access_token');
    if(token == null) {
      return false;
    }
    const payload = this.decodeJwtToken();
    if (!payload || !payload.exp) {
      return false;
    }
    return (Math.floor((new Date).getTime() / 1000)) >= payload.exp;
  }
  decodeJwtToken(): any {
    const token = localStorage.getItem('access_token');
    if(token == null) {
      return null;
    }
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
