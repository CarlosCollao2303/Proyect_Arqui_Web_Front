import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

// Agrega "Authorization: Bearer <token>" a las peticiones que van al backend
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Solo se envia el token a nuestro backend, nunca a otros dominios
  const backendUrl = `${environment.base}/`;
  if (!req.url.startsWith(backendUrl)) {
    return next(req);
  }

  // El login no lleva token
  if (req.url.endsWith('/login')) {
    return next(req);
  }

  // El registro de usuarios es publico y sin token siempre crea un PACIENTE, como
  // indica el formulario de usuarios (el rol se asigna despues desde "Asignar").
  // Con el token de un ADMIN el backend exigiria elegir el rol en el registro.
  if (req.method === 'POST' && req.url.endsWith('/api/usuarios/Registrar')) {
    return next(req);
  }

  const token = sessionStorage.getItem('token');
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
