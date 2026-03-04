import { Injectable, signal, computed } from '@angular/core';
import { Plato } from '../models/plato.model';
import { ItemCesta } from '../models/cesta.model';

@Injectable({
  providedIn: 'root',
})
export class CestaService {
  readonly items = signal<ItemCesta[]>([]);
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.plato.precio * item.cantidad, 0)
  );
  readonly cantidadTotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.cantidad, 0)
  );

  agregar(plato: Plato): void {
    const current = this.items();
    const existing = current.find((i) => i.plato.id === plato.id);
    if (existing) {
      this.items.set(
        current.map((i) =>
          i.plato.id === plato.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      this.items.set([...current, { plato, cantidad: 1 }]);
    }
  }

  quitar(platoId: number): void {
    const current = this.items();
    const existing = current.find((i) => i.plato.id === platoId);
    if (existing && existing.cantidad > 1) {
      this.items.set(
        current.map((i) =>
          i.plato.id === platoId ? { ...i, cantidad: i.cantidad - 1 } : i
        )
      );
    } else {
      this.items.set(current.filter((i) => i.plato.id !== platoId));
    }
  }

  vaciar(): void {
    this.items.set([]);
  }
}
