import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  rol: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/auth';
  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly rol = signal<string | null>(localStorage.getItem('rol'));
  readonly nombre = signal<string | null>(localStorage.getItem('nombre'));

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('nombre', res.nombre);
        this.token.set(res.token);
        this.rol.set(res.rol);
        this.nombre.set(res.nombre);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    this.token.set(null);
    this.rol.set(null);
    this.nombre.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    return this.rol() === 'administrador';
  }

  isPersonal(): boolean {
    return this.rol() === 'personal';
  }
}
