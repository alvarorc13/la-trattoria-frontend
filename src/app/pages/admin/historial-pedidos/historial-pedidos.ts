import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { PedidosService, Pedido } from '../../../services/pedidos';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.html',
  styleUrl: './historial-pedidos.css',
})
export class HistorialPedidos implements OnInit {
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);

  pedidos = signal<Pedido[]>([]);

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const token = this.authService.token();
    if (token) {
      this.pedidosService.getTodos(token).subscribe((pedidos: Pedido[]) => {
        this.pedidos.set(pedidos);
      });
    }
  }
}
