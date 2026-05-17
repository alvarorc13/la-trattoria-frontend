import { Usuario } from '../../../models/usuario.model';

export const USUARIOS_MOCK: Usuario[] = [
  { id: 1, nombre: 'Admin', email: 'admin@trattoria.com', rol: 'ADMINISTRADOR', activo: true },
  { id: 2, nombre: 'Personal', email: 'personal@trattoria.com', rol: 'PERSONAL', activo: true },
  { id: 3, nombre: 'Cliente', email: 'cliente@trattoria.com', rol: 'CLIENTE', activo: true }
];
