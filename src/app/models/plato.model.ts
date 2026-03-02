import { Categoria } from './categoria.model';

export interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  disponibilidad: 'activo' | 'inactivo';
  categoria: Categoria;
}
