import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { PedidosService, Pedido } from '../../../services/pedidos';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.html',
  styleUrl: './historial-pedidos.css',
  imports: [CurrencyPipe, DatePipe],
})
export class HistorialPedidos implements OnInit {
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);

  pedidos = signal<Pedido[]>([]);
  expandido = signal<number | null>(null);
  pagina = signal<number>(1);
  hayMas = signal<boolean>(false); // Paginación básica, ajustar según backend

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const token = this.authService.token();
    if (token) {
      this.pedidosService.getTodos(token).subscribe((pedidos: Pedido[]) => {
        this.pedidos.set(pedidos);
        // Si hay paginación real, ajustar hayMas
        this.hayMas.set(false);
      });
    }
  }

  estadoLabel(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En proceso';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  }

  toggleDetalle(id: number): void {
    this.expandido.set(this.expandido() === id ? null : id);
  }
}
