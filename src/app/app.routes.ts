import { Routes } from '@angular/router';

export const routes: Routes = [
  // Cliente (acceso por QR, sin login)
  {
    path: 'mesa/:mesaId',
    loadComponent: () =>
      import('./layout/cliente-layout/cliente-layout').then((m) => m.ClienteLayout),
    children: [
      { path: '', redirectTo: 'carta', pathMatch: 'full' },
      {
        path: 'carta',
        loadComponent: () =>
          import('./pages/cliente/carta/carta').then((m) => m.Carta),
      },
      {
        path: 'cesta',
        loadComponent: () =>
          import('./pages/cliente/cesta/cesta').then((m) => m.Cesta),
      },
      {
        path: 'pago',
        loadComponent: () =>
          import('./pages/cliente/pago/pago').then((m) => m.Pago),
      },
    ],
  },
  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },
  // Panel staff (personal y admin)
  {
    path: 'panel',
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./pages/personal/notificaciones/notificaciones').then((m) => m.Notificaciones),
      },
      {
        path: 'gestion-platos',
        loadComponent: () =>
          import('./pages/admin/gestion-platos/gestion-platos').then((m) => m.GestionPlatos),
      },
      {
        path: 'gestion-categorias',
        loadComponent: () =>
          import('./pages/admin/gestion-categorias/gestion-categorias').then((m) => m.GestionCategorias),
      },
            {
        path: 'gestion-pedidos',
        loadComponent: () =>
          import('./pages/admin/gestion-pedidos/gestion-pedidos').then((m) => m.GestionPedidos),
      },
      {
        path: 'gestion-usuarios',
        loadComponent: () =>
          import('./pages/admin/gestion-usuarios/gestion-usuarios').then((m) => m.GestionUsuarios),
      },
      {
        path: 'nuevo-plato',
        loadComponent: () =>
          import('./pages/admin/nuevo-plato/nuevo-plato').then((m) => m.NuevoPlato),
      },
      {
        path: 'editar-plato/:id',
        loadComponent: () =>
          import('./pages/admin/editar-plato/editar-plato').then((m) => m.EditarPlato),
      },
      { path: '', redirectTo: 'notificaciones', pathMatch: 'full' },
    ],
  },
  // Redirect por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
