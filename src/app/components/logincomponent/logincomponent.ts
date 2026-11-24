import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideHeartPulse } from '@lucide/angular';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-logincomponent',
  imports: [ReactiveFormsModule, RouterLink, LucideHeartPulse],
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css',
})
export class Logincomponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Loginservice);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMessage = '';
  submitting = false;

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.submitting = true;

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting = false;

        // Solo se aceptan rutas internas de la app como returnUrl
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const destination =
          returnUrl?.startsWith('/') && !returnUrl.startsWith('//') && returnUrl !== '/'
            ? returnUrl
            : this.rutaInicial();

        void this.router.navigateByUrl(destination);
      },
      error: () => {
        this.submitting = false;
        this.errorMessage =
          'No se pudo iniciar sesión. Verifica tus credenciales e inténtalo nuevamente.';
      },
    });
  }

  // Pantalla a la que entra cada rol si no venia de otra ruta
  private rutaInicial(): string {
    return this.auth.hasAnyRole(['ADMIN', 'MEDICO']) ? '/citas/listar' : '/citas/estado';
  }
}
