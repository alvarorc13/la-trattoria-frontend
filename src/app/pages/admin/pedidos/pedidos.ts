import { Component, OnInit } from '@angular/core';
import { PedidosService, Pedido } from '../../../services/pedidos.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css']
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  token: string = '';

  constructor(private pedidosService: PedidosService) {}

  ngOnInit() {
    // Aquí deberías obtener el token real del usuario logueado (ejemplo localStorage)
    this.token = localStorage.getItem('token') || '';
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.pedidosService.obtenerTodos(this.token).subscribe((data: Pedido[]) => {
      this.pedidos = data;
    });
  }

  eliminarPedido(id: number) {
    if (confirm('¿Seguro que quieres eliminar este pedido?')) {
      this.pedidosService.eliminarPedido(id, this.token).subscribe(() => {
        this.cargarPedidos();
      });
    }
  }
}
