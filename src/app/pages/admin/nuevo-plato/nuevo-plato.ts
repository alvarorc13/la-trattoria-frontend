import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlatosService } from '../../../services/platos';
import { CategoriasService } from '../../../services/categorias';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { Categoria } from '../../../models/categoria.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-nuevo-plato',
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './nuevo-plato.html',
  styleUrl: './nuevo-plato.css',
})
export class NuevoPlato implements OnInit {
  private fb = inject(FormBuilder);
  private platosService = inject(PlatosService);
  private categoriasService = inject(CategoriasService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  categorias = signal<Categoria[]>([]);

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    imagen: [''],
    categoriaId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.categoriasService.getAll().subscribe((c) => this.categorias.set(c));
  }

  crear(): void {
    if (this.form.invalid) return;
    const token = this.authService.token();
    if (!token) return;

    const v = this.form.getRawValue();
    const platoData = {
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      precio: v.precio!,
      imagen: v.imagen || '',
      disponibilidad: 'activo' as const,
      categoria: { id: v.categoriaId } as any,
    };

    this.platosService.create(platoData, token).subscribe(() => {
      this.toast.mostrar('Plato creado correctamente');
      this.router.navigate(['/panel/gestion-platos']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/panel/gestion-platos']);
  }
}
