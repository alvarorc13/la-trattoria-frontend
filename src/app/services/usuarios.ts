import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { API_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly apiUrl = `${API_URL}/usuarios`;

  constructor(private http: HttpClient) {}

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(token: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/admin/todos`, { headers: this.authHeaders(token) });
  }

  getById(id: number, token: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { headers: this.authHeaders(token) });
  }

  create(usuario: { nombre: string; email: string; passwordHash: string; rol: string }, token: string): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario, { headers: this.authHeaders(token) });
  }

  update(id: number, usuario: { nombre?: string; email?: string; passwordHash?: string; rol?: string; activo?: boolean }, token: string): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario, { headers: this.authHeaders(token) });
  }

  delete(id: number, token: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authHeaders(token) });
  }
}
