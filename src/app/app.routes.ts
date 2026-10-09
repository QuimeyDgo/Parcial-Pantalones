
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/catalogo/catalogo')
        .then(m => m.Catalogo)
  },
  {
    path: 'agregar',
    loadComponent: () =>
      import('./components/formulario/formulario')
        .then(m => m.Formulario)
  },
  {
    path: 'detalle/:id',
    loadComponent: () =>
      import('./components/detalles/detalles')
        .then(m => m.Detalles)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
