import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        if (this.authService.isAdmin()) {
          this.router.navigate(['/panel/gestion-platos']);
        } else {
          this.router.navigate(['/panel/notificaciones']);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Credenciales incorrectas');
      },
    });
  }
}
