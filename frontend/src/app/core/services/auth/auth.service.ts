import { Injectable } from '@angular/core';

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
}
