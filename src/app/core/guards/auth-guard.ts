import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Loginservice } from '../../services/loginservice';

// Solo deja pasar a usuarios con sesion iniciada (token valido y no expirado)
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Loginservice);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  // Al iniciar sesion se vuelve a la pagina que se queria abrir
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
