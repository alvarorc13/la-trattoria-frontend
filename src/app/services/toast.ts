import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  mensaje = signal('');
  visible = signal(false);

  private timeout: ReturnType<typeof setTimeout> | null = null;

  mostrar(mensaje: string): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.mensaje.set(mensaje);
    this.visible.set(true);
    this.timeout = setTimeout(() => this.visible.set(false), 3000);
  }
}
