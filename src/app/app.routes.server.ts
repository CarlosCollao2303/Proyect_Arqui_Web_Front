import { RenderMode, ServerRoute } from '@angular/ssr';

// Las paginas publicas se prerenderizan. Las rutas protegidas se renderizan en el
// navegador (RenderMode.Client): los guards leen el token de sessionStorage, que no
// existe en el servidor, y si se renderizaran ahi al recargar la pagina (F5) siempre
// mandarian al login aunque el usuario ya haya iniciado sesion.
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'tratamientos/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'diagnosticos/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'diagnosticos/detalle/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'examenes/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'recetas/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'recetas/detalle/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'especialidades/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'detallehistorial/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'citas/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'historiasclinicas/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'historiasclinicas/historial/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'roles/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'usuarios/actualizar/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'usuarios/asignar/:id',
    renderMode: RenderMode.Client,
  },
  {
    // La videollamada usa la API iframe de Jitsi, que solo existe en el navegador.
    path: 'citas/videollamada/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
