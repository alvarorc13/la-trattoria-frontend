import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios';
import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast';

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    rol: ['administrador', Validators.required],
    activo: [true]
  });

  usuarioId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.usuarioId = +id;
        const token = this.authService.token();
        if (!token) return;
        this.usuariosService.getById(this.usuarioId, token).subscribe(usuario => {
          this.form.patchValue({
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol?.toLowerCase?.() ?? usuario.rol,
            activo: usuario.activo
          });
        });
      }
    });
  }

  guardar(): void {
    if (this.form.invalid || this.usuarioId == null) return;
    const token = this.authService.token();
    if (!token) return;
    const v = this.form.getRawValue();
    const usuarioData: any = {
      nombre: v.nombre,
      email: v.email,
      rol: v.rol,
      activo: v.activo
    };
    if (v.password) usuarioData.passwordHash = v.password;
    this.usuariosService.update(this.usuarioId, usuarioData, token).subscribe(() => {
      this.toast.mostrar('Usuario actualizado correctamente');
      this.router.navigate(['/panel/gestion-usuarios']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/panel/gestion-usuarios']);
  }
}
