import { Component, inject, OnInit, signal } from '@angular/core';
import { PedidosService, Pedido } from '../../../services/pedidos.service';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.html',
  styleUrl: './gestion-pedidos.css'
})
export class GestionPedidos implements OnInit {
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  pedidos = signal<Pedido[]>([]);
  modalVisible = signal(false);
  modalMensaje = '';
  modalAccion: (() => void) | null = null;
  pedidoSeleccionado: Pedido | null = null;

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    const token = this.authService.token();
    if (token) {
      this.pedidosService.obtenerTodos(token).subscribe({
        next: (p: Pedido[]) => this.pedidos.set(p),
        error: () => this.toast.mostrar('No se pudieron cargar los pedidos')
      });
    }
  }

  confirmarEliminar(pedido: Pedido): void {
    this.pedidoSeleccionado = pedido;
    this.modalMensaje = `¿Eliminar el pedido de la mesa ${pedido.mesa.numero}?`;
    this.modalAccion = () => this.eliminarPedido(pedido.id);
    this.modalVisible.set(true);
  }

  eliminarPedido(id: number): void {
    const token = this.authService.token();
    if (!token) return;
    this.pedidosService.eliminarPedido(id, token).subscribe(() => {
      this.cargarPedidos();
      this.toast.mostrar('Pedido eliminado');
    });
  }

  aceptarModal(): void {
    this.modalAccion?.();
    this.modalVisible.set(false);
  }

  cerrarModal(): void {
    this.modalVisible.set(false);
  }
}
