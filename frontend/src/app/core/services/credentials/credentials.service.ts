import {Injectable} from '@angular/core';
import {Credential} from "../../models/saved-credential.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {forkJoin, Observable, switchMap} from "rxjs";
import * as CryptoJS from "crypto-js";
import * as Papa from 'papaparse';
import {SecurityService} from "../security/security.service";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  private API_URL = 'http://localhost:8000';

  constructor(private http:HttpClient, private securityService: SecurityService) { }

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

  getSaltMultiple(access_token: string, num: number): Observable<string[]> {
    const path = '/stored_credentials/get_salt_multiple?num=' + num;
    const headers = new HttpHeaders({
      'Authorization': access_token,
    });
    const options = { headers: headers };
    return this.http.get<string[]>(this.API_URL + path, options);
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

  importCredentials(access_token: string, file: File, masterPassword: string): Promise<any> {
    if(!file) {
      console.error('No file selected.');
      return Promise.reject('No file selected.');
    }
    return new Promise((resolve, reject) => {
      const path = '/stored_credentials/add_bulk';  // New endpoint for bulk add
      const headers = new HttpHeaders({
        'Authorization': access_token,
      });
      const options = { headers: headers };
      let credentialsToInsert: Credential[] = [];
      const fileExtension = file.name.split('.').pop();
      if(fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('Parsed Results:', results.data);
            try {
              const credentials: any[] = results.data as any[];
              // Get salts for all credentials in one call
              this.getSaltMultiple(access_token, credentials.length).pipe(
                switchMap((salts) => {
                  credentials.forEach((credential, index) => {
                    let nickname: string = credential.name || '';
                    let username: string = credential.username || '';
                    let password: string = credential.password || '';
                    let email: string = credential.email || '';
                    let url: string = credential.url || '';

                    const encryptedPassword = this.encrypt(password, masterPassword, salts[index]);
                    if (encryptedPassword == null) {
                      console.error('Error encrypting password.');
                      throw new Error('Error encrypting password.');
                    }

                    let newCredential: Credential = {
                      password: encryptedPassword,
                      username: username || undefined,
                      email: email || undefined,
                      nickname: nickname || undefined,
                      url: url || undefined,
                      salt: salts[index],
                      added_date: new Date(),
                    };
                    credentialsToInsert.push(newCredential);
                  });

                  return this.http.post(this.API_URL + path, credentialsToInsert, options);
                })
              ).subscribe(
                (result) => {
                  resolve(result);
                },
                (error) => {
                  console.error('Error inserting credentials:', error);
                  reject(error);
                }
              );
            } catch (e) {
              console.error('Error processing credentials:', e);
              reject(e);
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            reject(error);
          }
        });
      }
      else if (fileExtension === 'json') {
        //Javascript inherently supports JSON parsing
        let reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsedData = JSON.parse(reader.result as string);
            const credentials: any[] = parsedData as any[];

            // The rest of your processing logic here...
            this.getSaltMultiple(access_token, credentials.length).pipe(
              switchMap((salts) => {
                credentials.forEach((credential, index) => {
                  let nickname: string = credential.name || '';
                  let username: string = credential.username || '';
                  let password: string = credential.password || '';
                  let email: string = credential.email || '';
                  let url: string = credential.url || '';

                  const encryptedPassword = this.encrypt(password, masterPassword, salts[index]);
                  if (encryptedPassword == null) {
                    console.error('Error encrypting password.');
                    throw new Error('Error encrypting password.');
                  }

                  let newCredential: Credential = {
                    password: encryptedPassword,
                    username: username || undefined,
                    email: email || undefined,
                    nickname: nickname || undefined,
                    url: url || undefined,
                    salt: salts[index],
                    added_date: new Date(),
                  };
                  credentialsToInsert.push(newCredential);
                });

                return this.http.post(this.API_URL + path, credentialsToInsert, options);
              })
            ).subscribe(
              (result) => {
                resolve(result);
              },
              (error) => {
                console.error('Error inserting credentials:', error);
                reject(error);
              }
            );
          } catch (e) {
            console.error('Error processing JSON data:', e);
            reject(e);
          }
        };
        reader.onerror = (error) => {
          console.error('Error reading JSON file:', error);
          reject(error);
        };
        reader.readAsText(file);
      }
      else {
        console.error('Invalid file type.');
        reject('Invalid file type.');
      }
    });
  }
  async verifyMasterPassword(access_token: string, masterPassword: string, credential_id: string) {
    const path = `/stored_credentials/verify_master_password/${credential_id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': access_token,
    });
    const hashedMasterPassword = await this.securityService.hashPassword(masterPassword);
    const body = {
      master_password: hashedMasterPassword
    };

    return this.http.post(this.API_URL + path, body, { headers });
  }

  async exportPasswords(masterPassword: string, credentials: Credential[]) {
    const csvColumns = ['name', 'username', 'password', 'email', 'url'];
    const csvData = credentials.map(cred => {
      let p:string;
      if(!cred.salt) {
        p = '';
      } else {
        p = cred.encrypted_password? this.decrypt(cred.encrypted_password, masterPassword, cred.salt) : '';
      }
      return {
        name: cred.nickname,
        username: cred.username,
        password: p,
        email: cred.email,
        url: cred.url
      };
    });
    const csv = Papa.unparse({
      fields: csvColumns,
      data: csvData
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'credentials.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
