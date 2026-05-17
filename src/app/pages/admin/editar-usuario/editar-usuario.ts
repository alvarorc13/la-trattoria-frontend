import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-editar-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css',
})
export class EditarUsuario implements OnInit {
  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  usuario = signal<Usuario | null>(null);

  form = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    rol: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const token = this.authService.token();
    if (!token) return;

    this.usuariosService.getById(id, token).subscribe((u) => {
      this.usuario.set(u);
      this.form.patchValue({
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
      });
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const token = this.authService.token();
    const u = this.usuario();
    if (!token || !u) return;

    const v = this.form.getRawValue();
    const data: { nombre?: string; email?: string; password?: string; rol?: string } = {
      nombre: v.nombre!,
      email: v.email!,
      rol: v.rol!,
    };
    if (v.password) {
      data.password = v.password;
    }

    this.usuariosService.update(u.id, data, token).subscribe(() => {
      this.toast.mostrar('Usuario editado correctamente');
      this.router.navigate(['/panel/gestion-usuarios']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/panel/gestion-usuarios']);
  }
}
