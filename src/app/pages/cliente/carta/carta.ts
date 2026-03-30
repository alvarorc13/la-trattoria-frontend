import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { PlatosService } from '../../../services/platos';
import { CategoriasService } from '../../../services/categorias';
import { CestaService } from '../../../services/cesta';
import { Plato } from '../../../models/plato.model';
import { Categoria } from '../../../models/categoria.model';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-carta',
  imports: [CurrencyPipe, TitleCasePipe],
  templateUrl: './carta.html',
  styleUrl: './carta.css',
  host: { '(window:scroll)': 'onScroll()' },
})
export class Carta implements OnInit {
  private platosService = inject(PlatosService);
  private categoriasService = inject(CategoriasService);
  cestaService = inject(CestaService);

  categorias = signal<Categoria[]>([]);
  platos = signal<Plato[]>([]);
  categoriaActiva = signal<number | null>(null);
  platosVisibles = signal(12);
  cargando = signal(false);

  private readonly PAGE_SIZE = 12;

  ngOnInit(): void {
    this.categoriasService.getAll().subscribe((cats) => this.categorias.set(cats));
    this.platosService.getAll().subscribe((platos) => this.platos.set(platos));
  }

  filtrarPorCategoria(catId: number | null): void {
    this.categoriaActiva.set(catId);
    this.platosVisibles.set(this.PAGE_SIZE);
  }

  get platosFiltrados(): Plato[] {
    const catId = this.categoriaActiva();
    const todos = catId === null ? this.platos() : this.platos().filter((p) => p.categoria?.id === catId);
    return todos.slice(0, this.platosVisibles());
  }

  get totalFiltrados(): number {
    const catId = this.categoriaActiva();
    if (catId === null) return this.platos().length;
    return this.platos().filter((p) => p.categoria?.id === catId).length;
  }

  get hayMas(): boolean {
    return this.platosVisibles() < this.totalFiltrados;
  }

  onScroll(): void {
    if (this.cargando() || !this.hayMas) return;

    const umbral = 300;
    const posicion = window.innerHeight + window.scrollY;
    const altura = document.documentElement.scrollHeight;

    if (posicion >= altura - umbral) {
      this.cargarMas();
    }
  }

  private cargarMas(): void {
    this.cargando.set(true);
    setTimeout(() => {
      this.platosVisibles.update((v) => v + this.PAGE_SIZE);
      this.cargando.set(false);
    }, 300);
  }

  agregar(plato: Plato): void {
    this.cestaService.agregar(plato);
  }
}
