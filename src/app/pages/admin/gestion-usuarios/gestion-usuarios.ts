import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class GestionUsuarios implements OnInit {
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  usuarios = signal<any[]>([]);
  modalVisible = signal(false);
  modalMensaje = '';
  modalAccion: (() => void) | null = null;
  usuarioSeleccionado: any = null;

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    const token = this.authService.token();
    if (token) {
      this.usuariosService.getAll(token).subscribe({
        next: (u: any[]) => this.usuarios.set(u),
        error: () => this.toast.mostrar('No se pudieron cargar los usuarios')
      });
    }
  }

  confirmarEliminar(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.modalMensaje = `¿Eliminar el usuario ${usuario.nombre}?`;
    this.modalAccion = () => this.eliminarUsuario(usuario.id_usuario || usuario.id);
    this.modalVisible.set(true);
  }

  eliminarUsuario(id: number): void {
    const token = this.authService.token();
    if (!token) return;
    this.usuariosService.delete(id, token).subscribe(() => {
      this.cargarUsuarios();
      this.toast.mostrar('Usuario eliminado');
    });
  }

  aceptarModal(): void {
    this.modalAccion?.();
    this.modalVisible.set(false);
  }

  cerrarModal(): void {
    this.modalVisible.set(false);
  }
}
