import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.html',
  styleUrl: './nuevo-usuario.css',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class NuevoUsuario implements OnInit {
  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  mensaje = signal<string>('');

  form = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['CLIENTE', Validators.required],
    activo: [true],
  });

  ngOnInit(): void {}

  crear(): void {
    if (this.form.invalid) return;
    const token = this.authService.token();
    if (!token) return;
    const v = this.form.getRawValue();
    this.usuariosService.create({
      nombre: v.nombre!,
      email: v.email!,
      passwordHash: v.password!,
      rol: v.rol!,
      // activo no se envía en create, solo en update
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

  cancelar(): void {
    this.router.navigate(['/panel/gestion-usuarios']);
  }
}
