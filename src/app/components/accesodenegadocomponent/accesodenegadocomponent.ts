import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideShieldX } from '@lucide/angular';
import { Loginservice } from '../../services/loginservice';

// Se muestra cuando el roleGuard bloquea una ruta para el rol del usuario
@Component({
  selector: 'app-accesodenegadocomponent',
  imports: [RouterLink, LucideShieldX],
  templateUrl: './accesodenegadocomponent.html',
  styleUrl: './accesodenegadocomponent.css',
})
export class Accesodenegadocomponent {
  constructor(
    private readonly loginService: Loginservice,
    private readonly router: Router
  ) {}

  get rutaInicial(): string {
    return this.loginService.hasAnyRole(['ADMIN', 'MEDICO']) ? '/citas/listar' : '/citas/estado';
  }

  cerrarSesion(): void {
    this.loginService.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
