import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'tratamientos/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'diagnosticos/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'diagnosticos/detalle/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'examenes/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'recetas/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
