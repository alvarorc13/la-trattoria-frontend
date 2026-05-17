import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule],
})
export class NuevoUsuario implements OnInit {
  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);

  usuario = signal<any>({ rol: 'CLIENTE', activo: true, password: '' });
  mensaje = signal<string>('');

  ngOnInit(): void {}

  guardar(): void {
    const token = this.authService.token();
    const u = this.usuario();
    if (!u.nombre || !u.email || !u.password || !u.rol || !token) {
      this.mensaje.set('Completa todos los campos');
      return;
    }
    this.usuariosService.create({
      nombre: u.nombre,
      email: u.email,
      passwordHash: u.password,
      rol: u.rol
    }, token).subscribe({
      next: () => {
        this.mensaje.set('Usuario creado');
        setTimeout(() => this.router.navigate(['/panel/gestion-usuarios']), 1000);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.mensaje.set('Sesión expirada o sin permisos. Vuelve a iniciar sesión.');
        } else {
          this.mensaje.set('Error al crear usuario');
        }
      }
    });
  }
}
