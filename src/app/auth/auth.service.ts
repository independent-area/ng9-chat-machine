import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/user/'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Login method
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, data);
  }

  // Registration method
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Logout method
  logout(): Observable<any> {
    let data: any =  { token: localStorage.getItem('token') };
    return this.http.post(`${this.apiUrl}logout`, data);
  }

  // Logout method
  list(): Observable<any> {
    return this.http.get(`${this.apiUrl}list`);
  }
}
