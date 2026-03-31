import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CestaService } from '../../../services/cesta';
import { PedidosService } from '../../../services/pedidos';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pago',
  imports: [CurrencyPipe],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
})
export class Pago {
  cestaService = inject(CestaService);
  private pedidosService = inject(PedidosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  pagado = signal(false);
  procesando = signal(false);

  confirmarPago(): void {
    this.procesando.set(true);

    const mesaId = Number(this.route.parent?.snapshot.paramMap.get('mesaId'));
    const lineas = this.cestaService.items().map((item) => ({
      platoId: item.plato.id,
      cantidad: item.cantidad,
    }));

    this.pedidosService.crearPedido(mesaId, lineas).subscribe({
      next: () => {
        this.procesando.set(false);
        this.pagado.set(true);
        this.cestaService.vaciar();
      },
      error: () => {
        this.procesando.set(false);
      },
    });
  }

  volverACarta(): void {
    this.router.navigate(['../carta'], { relativeTo: this.route });
  }
}
