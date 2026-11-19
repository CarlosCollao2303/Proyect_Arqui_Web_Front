import { ChangeDetectorRef, Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LucideCircleCheck, LucideCircleX, LucideClock3, LucideSearch } from '@lucide/angular';
import { CitaEstado } from '../../../models/CitaEstado';
import { Citasservice } from '../../../services/citasservice';
import { fechaLocal } from '../../../utils/fechas';

@Component({
  selector: 'app-cestadocomponent',
  imports: [DatePipe, MatButtonModule, MatCardModule, LucideCircleCheck, LucideCircleX, LucideClock3, LucideSearch],
  templateUrl: './cestadocomponent.html',
  styleUrl: './cestadocomponent.css',
})
export class Cestadocomponent {
  citaEstado: CitaEstado | null = null;
  mensajeBusqueda = '';

  constructor(private cS: Citasservice,
    private cdr: ChangeDetectorRef
  ) { }

  buscarEstado(idValue: string): void {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.citaEstado = null;
      this.mensajeBusqueda = 'Ingrese un ID válido.';
      return;
    }

    this.cS.getEstadoCita(id).subscribe({
      next: (data) => {
        this.citaEstado = data;
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.citaEstado = null;
        this.mensajeBusqueda = `No se encontró la cita: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  fecha(valor: string): Date | null {
    return fechaLocal(valor);
  }

  hora(valor: string): string {
    return valor ? valor.substring(0, 5) : '';
  }
}
