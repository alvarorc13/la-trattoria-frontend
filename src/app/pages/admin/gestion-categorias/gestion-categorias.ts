import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '../../../services/categorias';
import { AuthService } from '../../../services/auth';
import { Categoria } from '../../../models/categoria.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-gestion-categorias',
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './gestion-categorias.html',
  styleUrl: './gestion-categorias.css',
})
export class GestionCategorias implements OnInit {
  private categoriasService = inject(CategoriasService);
  private authService = inject(AuthService);

  categorias = signal<Categoria[]>([]);
  nuevaCategoria = '';

  modalVisible = signal(false);
  modalMensaje = '';
  modalAccion: (() => void) | null = null;

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriasService.getAll().subscribe((c) => this.categorias.set(c));
  }

  crearCategoria(): void {
    const token = this.authService.token();
    if (!token || !this.nuevaCategoria.trim()) return;
    this.categoriasService.create(this.nuevaCategoria.trim(), token).subscribe(() => {
      this.nuevaCategoria = '';
      this.cargarCategorias();
    });
  }

  confirmarEliminar(cat: Categoria): void {
    this.modalMensaje = `¿Eliminar la categoría "${cat.nombre}"? Los platos de esta categoría podrían verse afectados.`;
    this.modalAccion = () => {
      const token = this.authService.token();
      if (!token) return;
      this.categoriasService.delete(cat.id, token).subscribe(() => this.cargarCategorias());
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
