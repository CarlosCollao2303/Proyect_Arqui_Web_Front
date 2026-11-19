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
    path: 'recetas/detalle/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'especialidades/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'detallehistorial/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'citas/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'historiasclinicas/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'roles/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'usuarios/actualizar/:id',
    renderMode: RenderMode.Server,
  },
  {
    // La videollamada usa la API iframe de Jitsi, que solo existe en el navegador.
    path: 'citas/videollamada/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
