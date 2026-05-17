import { Component, inject, OnInit, OnDestroy, signal, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { PedidosService, Pedido } from '../../../services/pedidos';
import { AuthService } from '../../../services/auth';
import { CurrencyPipe, DatePipe } from '@angular/common';

const PAGE_SIZE = 15;

@Component({
  selector: 'app-historial-pedidos',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './historial-pedidos.html',
  styleUrl: './historial-pedidos.css',
})
export class HistorialPedidos implements OnInit, AfterViewInit, OnDestroy {
  private pedidosService = inject(PedidosService);
  private authService = inject(AuthService);

  private todosPedidos: Pedido[] = [];
  private observer: IntersectionObserver | null = null;

  pedidos = signal<Pedido[]>([]);
  hayMas = signal(false);
  expandido = signal<number | null>(null);

  @ViewChild('scrollSentinel') scrollSentinel!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.cargarPedidos();
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.hayMas()) {
        this.cargarMas();
      }
    }, { threshold: 0.1 });
    this.observer.observe(this.scrollSentinel.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  cargarPedidos(): void {
    const token = this.authService.token();
    if (token) {
      this.pedidosService.getTodos(token).subscribe((p) => {
        this.todosPedidos = p;
        this.pedidos.set(p.slice(0, PAGE_SIZE));
        this.hayMas.set(p.length > PAGE_SIZE);
      });
    }
  }

  cargarMas(): void {
    const actual = this.pedidos().length;
    const siguiente = this.todosPedidos.slice(0, actual + PAGE_SIZE);
    this.pedidos.set(siguiente);
    this.hayMas.set(siguiente.length < this.todosPedidos.length);
  }

  toggleDetalle(id: number): void {
    this.expandido.set(this.expandido() === id ? null : id);
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      nuevo: 'Nuevo',
      en_camino: 'En camino',
    };
    return map[estado] ?? estado;
  }
}
