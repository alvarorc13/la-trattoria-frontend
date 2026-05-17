import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-nuevo-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-usuario.html',
  styleUrl: './nuevo-usuario.css',
})
export class NuevoUsuario {
  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  form = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['', Validators.required],
  });

  crear(): void {
    if (this.form.invalid) return;
    const token = this.authService.token();
    if (!token) return;

    const v = this.form.getRawValue();
    this.usuariosService
      .create(
        { nombre: v.nombre!, email: v.email!, password: v.password!, rol: v.rol! },
        token
      )
      .subscribe(() => {
        this.toast.mostrar('Usuario creado correctamente');
        this.router.navigate(['/panel/gestion-usuarios']);
      });
  }

  cancelar(): void {
    this.router.navigate(['/panel/gestion-usuarios']);
  }
}
