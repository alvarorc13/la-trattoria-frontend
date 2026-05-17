import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth';
import { Usuario } from '../../../models/usuario.model';
import { signal } from '@angular/core';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.html',
  styleUrl: './nuevo-usuario.css',
  standalone: true,
})
export class NuevoUsuario implements OnInit {
  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);

  usuario = signal<Partial<Usuario>>({ rol: 'CLIENTE', activo: true });
  mensaje = signal<string>('');

  ngOnInit(): void {}

  guardar(): void {
    const token = this.authService.token();
    const u = this.usuario();
    if (!u.nombre || !u.email || !u.password || !u.rol || !token) {
      this.mensaje.set('Completa todos los campos');
      return;
    }
    this.usuariosService.create(u as any, token).subscribe({
      next: () => {
        this.mensaje.set('Usuario creado');
        setTimeout(() => this.router.navigate(['/panel/gestion-usuarios']), 1000);
      },
      error: () => this.mensaje.set('Error al crear usuario')
    });
  }
}
