import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Role } from '../shared/models/role.enum';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';
  private roleKey = 'user_role';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiBaseUrl}/auth/login`, { username, password })
      .pipe(
        tap(res => {
          if (res && res.success && res.data) {
            localStorage.setItem(this.tokenKey, res.data.token);
            localStorage.setItem(this.roleKey, res.data.role);
          }
        })
      );
  }


  register(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/auth/register`, payload);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): Role | null {
    const role = localStorage.getItem(this.roleKey);
    return role ? (role as Role) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
