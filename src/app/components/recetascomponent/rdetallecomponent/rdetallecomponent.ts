import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LucideArrowLeft } from '@lucide/angular';
import { finalize, timeout } from 'rxjs';
import { Recetas } from '../../../models/Recetas';
import { Recetasservice } from '../../../services/recetasservice';

@Component({
  selector: 'app-rdetallecomponent',
  imports: [DatePipe, MatButtonModule, RouterLink, LucideArrowLeft],
  templateUrl: './rdetallecomponent.html',
  styleUrl: './rdetallecomponent.css',
})
export class Rdetallecomponent implements OnInit {
  receta: Recetas | null = null;
  mensajeError = '';
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Recetasservice,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    const recetaSeleccionada = navigationState?.['receta'];
    if (this.esReceta(recetaSeleccionada)) {
      this.receta = recetaSeleccionada;
      this.cargando = false;
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeError = 'El ID de la receta no es válido.';
      this.cargando = false;
      return;
    }

    this.service.getRecetaById(id).pipe(
      timeout({ first: 10000 }),
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      }),
    ).subscribe({
      next: (receta) => {
        this.receta = receta;
      },
      error: (error) => {
        this.mensajeError = error.name === 'TimeoutError'
          ? 'La solicitud tardó demasiado. Intenta nuevamente.'
          : `No se pudo cargar la receta: ${error.message}`;
      },
    });
  }

  private esReceta(value: unknown): value is Recetas {
    return typeof value === 'object'
      && value !== null
      && 'idReceta' in value
      && 'medicamento' in value
      && 'dosis' in value
      && 'frecuencia' in value
      && 'duracionDias' in value
      && 'indicaciones' in value
      && 'fechaEmision' in value;
  }
}
