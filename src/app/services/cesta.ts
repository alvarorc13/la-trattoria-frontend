import { Injectable, signal, computed } from '@angular/core';
import { Plato } from '../models/plato.model';
import { ItemCesta } from '../models/cesta.model';

@Injectable({
  providedIn: 'root',
})
export class CestaService {
  private readonly storageKey = 'la-trattoria-cesta';
  readonly items = signal<ItemCesta[]>(this.cargarItems());
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
      this.actualizar(
        current.map((i) =>
          i.plato.id === plato.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      this.actualizar([...current, { plato, cantidad: 1 }]);
    }
  }

  quitar(platoId: number): void {
    const current = this.items();
    const existing = current.find((i) => i.plato.id === platoId);
    if (existing && existing.cantidad > 1) {
      this.actualizar(
        current.map((i) =>
          i.plato.id === platoId ? { ...i, cantidad: i.cantidad - 1 } : i
        )
      );
    } else {
      this.eliminar(platoId);
    }
  }

  eliminar(platoId: number): void {
    this.actualizar(this.items().filter((i) => i.plato.id !== platoId));
  }

  vaciar(): void {
    this.actualizar([]);
  }

  private actualizar(items: ItemCesta[]): void {
    this.items.set(items);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
    }
  }

  private cargarItems(): ItemCesta[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return [];
      }

      const items: unknown = JSON.parse(stored);
      if (!Array.isArray(items)) {
        return [];
      }

      return items.filter(
        (item): item is ItemCesta =>
          typeof item === 'object' &&
          item !== null &&
          'plato' in item &&
          'cantidad' in item &&
          typeof item.cantidad === 'number' &&
          item.cantidad > 0
      );
    } catch {
      return [];
    }
  }
}
