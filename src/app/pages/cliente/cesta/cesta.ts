import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CestaService } from '../../../services/cesta';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cesta',
  imports: [CurrencyPipe],
  templateUrl: './cesta.html',
  styleUrl: './cesta.css',
})
export class Cesta {
  cestaService = inject(CestaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  irAPago(): void {
    this.router.navigate(['../pago'], { relativeTo: this.route });
  }

  irACarta(): void {
    this.router.navigate(['../carta'], { relativeTo: this.route });
  }
}
