import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LucideArrowLeft } from '@lucide/angular';
import { finalize, timeout } from 'rxjs';
import { Diagnosticos } from '../../../models/Diagnosticos';
import { Diagnosticosservice } from '../../../services/diagnosticosservice';

@Component({
  selector: 'app-ddetallecomponent',
  imports: [DatePipe, MatButtonModule, RouterLink, LucideArrowLeft],
  templateUrl: './ddetallecomponent.html',
  styleUrl: './ddetallecomponent.css',
})
export class Ddetallecomponent implements OnInit {
  diagnostico: Diagnosticos | null = null;
  mensajeError = '';
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Diagnosticosservice,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    const diagnosticoSeleccionado = navigationState?.['diagnostico'];
    if (this.esDiagnostico(diagnosticoSeleccionado)) {
      this.diagnostico = diagnosticoSeleccionado;
      this.cargando = false;
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeError = 'El ID del diagnóstico no es válido.';
      this.cargando = false;
      return;
    }

    this.service.getDiagnosticoById(id).pipe(
      timeout({ first: 10000 }),
      finalize(() => {
        this.cargando = false;
        this.cdr.detectChanges();
      }),
    ).subscribe({
      next: (diagnostico) => {
        this.diagnostico = diagnostico;
      },
      error: (error) => {
        this.mensajeError = error.name === 'TimeoutError'
          ? 'La solicitud tardó demasiado. Intenta nuevamente.'
          : `No se pudo cargar el diagnóstico: ${error.message}`;
      },
    });
  }

  private esDiagnostico(value: unknown): value is Diagnosticos {
    return typeof value === 'object'
      && value !== null
      && 'idDiagnostico' in value
      && 'codigoCie10' in value
      && 'descripcion' in value
      && 'fechaRegistro' in value;
  }
}