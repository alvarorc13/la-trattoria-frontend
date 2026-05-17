import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { Usuario } from '../../../models/usuario.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-gestion-usuarios',
  imports: [TitleCasePipe],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css',
})
export class GestionUsuarios implements OnInit {
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  usuarios = signal<Usuario[]>([]);

  modalVisible = signal(false);
  modalMensaje = '';
  modalAccion: (() => void) | null = null;

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    const token = this.authService.token();
    if (token) {
      this.usuariosService.getAll(token).subscribe({
        next: (u) => this.usuarios.set(u),
        error: (err) => console.error('Error cargando usuarios:', err),
      });
    }
  }

  nuevoUsuario(): void {
    this.router.navigate(['/panel/nuevo-usuario']);
  }

  editarUsuario(usuario: Usuario): void {
    this.router.navigate(['/panel/editar-usuario', usuario.id]);
  }

  confirmarEliminar(usuario: Usuario): void {
    this.modalMensaje = `¿Eliminar al usuario "${usuario.nombre}"? Esta acción no se puede deshacer.`;
    this.modalAccion = () => {
      const token = this.authService.token();
      if (!token) return;
      this.usuariosService.delete(usuario.id, token).subscribe(() => {
        this.cargarUsuarios();
        this.toast.mostrar(`Usuario "${usuario.nombre}" eliminado`);
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
