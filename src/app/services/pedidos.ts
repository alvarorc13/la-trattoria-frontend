import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';

export interface DetallePedido {
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Pedido {
  id: number;
  mesa: { id: number; numero: number };
  estado: string;
  fechaHora: string;
  total: number;
  detalles: DetallePedido[];
}

export interface LineaPedido {
  platoId: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private readonly apiUrl = `${API_URL}/pedidos`;

  constructor(private http: HttpClient) {}

  crearPedido(mesaId: number, lineas: LineaPedido[]): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, { mesaId, metodoPago: 'tarjeta', lineas });
  }

  getPendientes(token: string): Observable<Pedido[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Pedido[]>(`${this.apiUrl}/pendientes`, { headers });
  }

  marcarLeido(id: number, token: string): Observable<Pedido> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/leido`, {}, { headers });
  }

  marcarEntregado(id: number, token: string): Observable<Pedido> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/entregar`, {}, { headers });
  }
}
