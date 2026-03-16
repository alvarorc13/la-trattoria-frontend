import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { CestaService } from '../../services/cesta';

@Component({
  selector: 'app-cliente-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './cliente-layout.html',
  styleUrl: './cliente-layout.css',
})
export class ClienteLayout {
  private route = inject(ActivatedRoute);
  cestaService = inject(CestaService);

  get mesaId(): string {
    return this.route.snapshot.paramMap.get('mesaId') ?? '';
  }
}
