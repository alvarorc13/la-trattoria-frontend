export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'administrador' | 'personal';
  activo: boolean;
}
