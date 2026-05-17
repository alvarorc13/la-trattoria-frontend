import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/categorias';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  create(nombre: string, token: string): Observable<Categoria> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<Categoria>(this.apiUrl, { nombre }, { headers });
  }

  delete(id: number, token: string): Observable<void> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
