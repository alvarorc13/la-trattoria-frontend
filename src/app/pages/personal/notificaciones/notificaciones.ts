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
  private stompClient: any = null;

  ngOnInit(): void {
    this.cargarPedidos();
    this.initWebSocket();
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

  initWebSocket(): void {
    const token = this.authService.token();
    if (!token) return;

    (async () => {
      try {
        if (!(globalThis as any).global) {
          (globalThis as any).global = globalThis;
        }

        // Dynamic imports avoid TypeScript module resolution issues during build
        const stompModule: any = await import('@stomp/stompjs');
        const sockjsModule: any = await import('sockjs-client');
        const SockJS = sockjsModule?.default?.default || sockjsModule?.default || sockjsModule;

        const stompApi = stompModule?.default || stompModule;
        const Client = stompApi.Client || stompApi.Stomp?.Client;
        if (typeof Client !== 'function') {
          throw new TypeError('La exportación de @stomp/stompjs no contiene Client');
        }

        const backendUrl = 'https://la-trattoria-backend-243488375206.europe-southwest1.run.app/ws?access_token=' + token;
        const wsUrl = backendUrl;

        const client = new Client({
          webSocketFactory: () => new SockJS(wsUrl),
          debug: () => {},
        });

        client.onConnect = () => {
          client.subscribe('/topic/notificaciones/cocineros', (msg: any) => {
            try {
              const payload = JSON.parse(msg.body);
              const nuevo: Pedido = {
                id: payload.pedidoId,
                mesa: payload.mesa || { id: null, numero: '—' },
                estado: 'nuevo',
                fechaHora: payload.fechaHora,
                total: payload.total || 0,
                detalles: payload.detalles || [],
              } as any;
              this.pedidos.set([nuevo, ...this.pedidos()]);
            } catch (e) {
              console.error('Error parseando mensaje WS', e);
            }
          });
        };

        client.onStompError = (frame: any) => {
          console.error('STOMP error', frame);
        };

        client.activate();
        this.stompClient = client;
      } catch (e) {
        console.error('Error inicializando websocket', e);
      }
    })();
  }

  marcarLeido(id: number): void {
    const token = this.authService.token();
    if (token) {
      this.pedidosService.marcarLeido(id, token).subscribe(() => {
        this.pedidos.set(this.pedidos().filter((p) => p.id !== id));
      });
    }
  }

  ngOnDestroy(): void {
    if (this.stompClient && this.stompClient.deactivate) {
      try { this.stompClient.deactivate(); } catch (e) { }
    } else if (this.stompClient && this.stompClient.disconnect) {
      try { this.stompClient.disconnect(() => {}); } catch (e) { }
    }
  }
}
