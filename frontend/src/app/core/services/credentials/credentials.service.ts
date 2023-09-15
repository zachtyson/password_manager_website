import { Injectable } from '@angular/core';
import {Credential} from "../../models/saved-credential.model";
import {User} from "../../models/user.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {forkJoin, Observable} from "rxjs";
import * as CryptoJS from "crypto-js";
import * as Papa from 'papaparse';

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

  createCredential(access_token: string, credential: Credential): Observable<Credential> {
    const path = '/stored_credentials/add';
    const headers = new HttpHeaders({
      'Authorization': access_token,
    });
    const options = { headers: headers };
    return this.http.post<Credential>(this.API_URL + path, credential, options);
  }
  deriveKey(masterPassword: string, salt: string): string {
    return CryptoJS.PBKDF2(masterPassword, salt, { keySize: 256/32, iterations: 1000 }).toString();
  }
  encrypt(p: string, masterPassword: string, salt: string) {
    const derivedKey = this.deriveKey(masterPassword, salt);
    const iv = CryptoJS.lib.WordArray.random(128/8);
    const ciphertext = CryptoJS.AES.encrypt(p, derivedKey, { iv: iv }).toString();
    const hash = CryptoJS.SHA256(derivedKey).toString();
    return iv.toString() + ":" + ciphertext;
  }

  decrypt(p: string, masterPassword: string, salt: string) {
    const [ivStr, ciphertext] = p.split(':');
    const derivedKey = this.deriveKey(masterPassword, salt);
    const originalText = CryptoJS.AES.decrypt(ciphertext, derivedKey, { iv: CryptoJS.enc.Hex.parse(ivStr) }).toString(CryptoJS.enc.Utf8);
    return originalText;
  }

  importCredentials(access_token: string, file:File,masterPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = '/stored_credentials/add';
      const headers = new HttpHeaders({
        'Authorization': access_token,
      });
      const options = { headers: headers };
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Parsed Results:', results.data);
          try {
            //todo: convert this to actually create credentials
            const credentials: Credential[] = results.data as Credential[];
            const observables = [];
            for(let credential of credentials) {
              observables.push(this.createCredential(access_token, credential));
            }

            forkJoin(observables).subscribe(
              (results) => {
                console.log('All credentials created:', results);
                resolve(results);  // resolve the promise with results
              },
              (error) => {
                console.error('Error creating some or all credentials:', error);
                reject(error);  // reject the promise with the error
              }
            );
          } catch (e) {
            console.error('Error parsing CSV:', e);
            reject(e);  // reject the promise with the parsing error
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);  // reject the promise with the parsing error
        }
      });
    });
  }
}
