import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth';
import { Usuario } from '../../../models/usuario.model';
import { signal } from '@angular/core';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css',
  standalone: true,
})
export class EditarUsuario implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);
  mensaje = signal<string>('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const token = this.authService.token();
    if (!id || !token) {
      this.router.navigate(['/panel/gestion-usuarios']);
      return;
    }
    this.usuariosService.getById(id, token).subscribe({
      next: (u) => this.usuario.set(u),
      error: () => this.router.navigate(['/panel/gestion-usuarios'])
    });
  }

  guardar(): void {
    const token = this.authService.token();
    const u = this.usuario();
    if (!u || !token) return;
    this.usuariosService.update(u.id, u, token).subscribe({
      next: () => {
        this.mensaje.set('Usuario actualizado');
        setTimeout(() => this.router.navigate(['/panel/gestion-usuarios']), 1000);
      },
      error: () => this.mensaje.set('Error al actualizar usuario')
    });
  }

  eliminar(): void {
    const token = this.authService.token();
    const u = this.usuario();
    if (!u || !token) return;
    this.usuariosService.delete(u.id, token).subscribe({
      next: () => this.router.navigate(['/panel/gestion-usuarios']),
      error: () => this.mensaje.set('Error al eliminar usuario')
    });
  }
}
