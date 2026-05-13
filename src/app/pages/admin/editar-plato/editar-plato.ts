import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatosService } from '../../../services/platos';
import { CategoriasService } from '../../../services/categorias';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { Plato } from '../../../models/plato.model';
import { Categoria } from '../../../models/categoria.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-editar-plato',
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './editar-plato.html',
  styleUrl: './editar-plato.css',
})
export class EditarPlato implements OnInit {
  private fb = inject(FormBuilder);
  private platosService = inject(PlatosService);
  private categoriasService = inject(CategoriasService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categorias = signal<Categoria[]>([]);
  plato = signal<Plato | null>(null);

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    imagen: [''],
    categoriaId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.categoriasService.getAll().subscribe((c) => this.categorias.set(c));

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const token = this.authService.token();
    if (!token) return;

    this.platosService.getAllAdmin(token).subscribe((platos) => {
      const p = platos.find((pl) => pl.id === id);
      if (p) {
        this.plato.set(p);
        this.form.patchValue({
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          imagen: p.imagen,
          categoriaId: p.categoria?.id ?? 0,
        });
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const token = this.authService.token();
    const p = this.plato();
    if (!token || !p) return;

    const v = this.form.getRawValue();
    const platoData: Partial<Plato> = {
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      precio: v.precio!,
      imagen: v.imagen || '',
      disponibilidad: p.disponibilidad,
      categoria: { id: v.categoriaId } as any,
    };

    this.platosService.update(p.id, platoData, token).subscribe(() => {
      this.toast.mostrar('Plato editado correctamente');
      this.router.navigate(['/panel/gestion-platos']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/panel/gestion-platos']);
  }
}
