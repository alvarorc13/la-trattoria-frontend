import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plato } from '../models/plato.model';

@Injectable({
  providedIn: 'root',
})
export class PlatosService {
  private readonly apiUrl = 'https://la-trattoria-backend-production.up.railway.app/api/v1/platos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Plato[]> {
    return this.http.get<Plato[]>(this.apiUrl);
  }

  getAllAdmin(token: string): Observable<Plato[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Plato[]>(`${this.apiUrl}/admin/todos`, { headers });
  }

  getByCategoria(idCategoria: number): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}/categoria/${idCategoria}`);
  }

  create(plato: Partial<Plato>, token: string): Observable<Plato> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<Plato>(this.apiUrl, plato, { headers });
  }

  update(id: number, plato: Partial<Plato>, token: string): Observable<Plato> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<Plato>(`${this.apiUrl}/${id}`, plato, { headers });
  }

  delete(id: number, token: string): Observable<void> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
