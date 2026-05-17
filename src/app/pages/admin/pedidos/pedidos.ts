import { Component, inject, OnInit, signal } from '@angular/core';
import { PedidosService, Pedido } from '../../../services/pedidos';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
  imports: [CurrencyPipe, TitleCasePipe],
})
 export class Pedidos implements OnInit {
   private pedidosService = inject(PedidosService);
   private authService = inject(AuthService);
   private toast = inject(ToastService);

   pedidos = signal<Pedido[]>([]);
   loading = signal(false);

   modalVisible = signal(false);
   modalMensaje = '';
   modalAccion: (() => void) | null = null;

   ngOnInit(): void {
     this.cargarPedidos();
   }

   cargarPedidos(): void {
     const token = this.authService.token();
     if (!token) return;
     this.loading.set(true);
     this.pedidosService.getPendientes(token).subscribe({
       next: (p) => this.pedidos.set(p),
       complete: () => this.loading.set(false),
     });
   }

   marcarLeido(pedido: Pedido): void {
     const token = this.authService.token();
     if (!token) return;
     this.pedidosService.marcarLeido(pedido.id, token).subscribe(() => {
       this.cargarPedidos();
       this.toast.mostrar('Pedido marcado como leído');
     });
   }

   marcarEntregado(pedido: Pedido): void {
     this.modalMensaje = `¿Marcar el pedido de la mesa ${pedido.mesa.numero} como entregado?`;
     this.modalAccion = () => {
       const token = this.authService.token();
       if (!token) return;
       this.pedidosService.marcarEntregado(pedido.id, token).subscribe(() => {
         this.cargarPedidos();
         this.toast.mostrar('Pedido entregado');
       });
     };
     this.modalVisible.set(true);
   }

   aceptarModal(): void {
     this.modalAccion?.();
     this.modalVisible.set(false);
   }

   cerrarModal(): void {
     this.modalVisible.set(false);
   }
 }
