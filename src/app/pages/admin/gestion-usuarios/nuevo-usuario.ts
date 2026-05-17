import { Usuario } from '../../../models/usuario.model';

export class NuevoUsuario implements Usuario {
  id: number = 0;
  nombre: string = '';
  email: string = '';
  rol: string = 'CLIENTE';
  activo: boolean = true;

  constructor(init?: Partial<NuevoUsuario>) {
    Object.assign(this, init);
  }
}
