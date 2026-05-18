import { Component, inject, OnInit, signal } from '@angular/core';
import { PedidosService, Pedido } from '../../../services/pedidos.service';
import { AuthService } from '../../../services/auth';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
})
export class Notificaciones implements OnInit {
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);

  pedidos = signal<Pedido[]>([]);

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    const token = this.authService.token();
    if (token) {
      this.pedidosService.getPendientes(token).subscribe({
        next: (pedidos) => this.pedidos.set(pedidos),
        error: () => this.pedidos.set([]),
      });
    }
  }

  marcarLeido(id: number): void {
    const token = this.authService.token();
    if (token) {
      this.pedidosService.marcarLeido(id, token).subscribe(() => {
        this.pedidos.set(this.pedidos().filter((p) => p.id !== id));
      });
    }
  }
}
