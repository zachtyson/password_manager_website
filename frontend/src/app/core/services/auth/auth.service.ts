import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Clear all items from local storage
  clearLocalStorage() {
    localStorage.clear();
  }
}
