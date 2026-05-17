import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class EditarUsuario implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);
  mensaje = signal<string>('');

  private fb = inject(FormBuilder);
  form = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rol: ['', Validators.required],
    activo: [true],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const token = this.authService.token();
    if (!id || !token) {
      this.mensaje.set('No se pudo cargar el usuario. Token inválido o ID incorrecto.');
      return;
    }
    this.usuariosService.getById(id, token).subscribe({
      next: (u) => {
        this.usuario.set(u);
        this.form.patchValue({
          nombre: u.nombre,
          email: u.email,
          rol: u.rol,
          activo: u.activo,
        });
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.mensaje.set('Sesión expirada o sin permisos. Vuelve a iniciar sesión.');
        } else {
          this.mensaje.set('No se pudo cargar el usuario.');
        }
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const token = this.authService.token();
    const u = this.usuario();
    if (!u || !token) return;
    const v = this.form.getRawValue();
    this.usuariosService.update(u.id, {
      nombre: v.nombre!,
      email: v.email!,
      rol: v.rol!,
      activo: v.activo!
    }, token).subscribe({
      next: () => {
        this.mensaje.set('Usuario actualizado');
        setTimeout(() => this.router.navigate(['/panel/gestion-usuarios']), 1000);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.mensaje.set('Sesión expirada o sin permisos. Vuelve a iniciar sesión.');
        } else {
          this.mensaje.set('Error al actualizar usuario');
        }
      }
    });
  }

  eliminar(): void {
    const token = this.authService.token();
    const u = this.usuario();
    if (!u || !token) return;
    this.usuariosService.delete(u.id, token).subscribe({
      next: () => this.router.navigate(['/panel/gestion-usuarios']),
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.mensaje.set('Sesión expirada o sin permisos. Vuelve a iniciar sesión.');
        } else {
          this.mensaje.set('Error al eliminar usuario');
        }
      }
    });
  }
}
