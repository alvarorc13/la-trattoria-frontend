import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PlatosService } from '../../../services/platos';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { Plato } from '../../../models/plato.model';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-gestion-platos',
  imports: [CurrencyPipe, TitleCasePipe],
  templateUrl: './gestion-platos.html',
  styleUrl: './gestion-platos.css',
})
export class GestionPlatos implements OnInit {
  private platosService = inject(PlatosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  platos = signal<Plato[]>([]);

  modalVisible = signal(false);
  modalMensaje = '';
  modalAccion: (() => void) | null = null;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    const token = this.authService.token();
    if (token) {
      this.platosService.getAllAdmin(token).subscribe((p) => this.platos.set(p));
    }
  }

  nuevoPlato(): void {
    this.router.navigate(['/panel/nuevo-plato']);
  }

  editarPlato(plato: Plato): void {
    this.router.navigate(['/panel/editar-plato', plato.id]);
  }

  confirmarToggle(plato: Plato): void {
    const accion = plato.disponibilidad === 'activo' ? 'desactivar' : 'activar';
    this.modalMensaje = `¿Quieres ${accion} el plato "${plato.nombre}"?`;
    this.modalAccion = () => {
      const token = this.authService.token();
      if (!token) return;
      const nuevaDisp = plato.disponibilidad === 'activo' ? 'inactivo' : 'activo';
      this.platosService.update(plato.id, { ...plato, disponibilidad: nuevaDisp }, token).subscribe(() => {
        this.cargarDatos();
        this.toast.mostrar(`Plato "${plato.nombre}" ${nuevaDisp === 'activo' ? 'activado' : 'desactivado'}`);
      });
    };
    this.modalVisible.set(true);
  }

  confirmarEliminar(plato: Plato): void {
    this.modalMensaje = `¿Eliminar el plato "${plato.nombre}"? Esta acción no se puede deshacer.`;
    this.modalAccion = () => {
      const token = this.authService.token();
      if (!token) return;
      this.platosService.delete(plato.id, token).subscribe(() => {
        this.cargarDatos();
        this.toast.mostrar(`Plato "${plato.nombre}" eliminado`);
      });
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
