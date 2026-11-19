import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LucideSearch } from '@lucide/angular';
import { Especialidades } from '../../../models/Especialidades';
import { MedicoPorEspecialidad } from '../../../models/MedicoPorEspecialidad';
import { Especialidadesservice } from '../../../services/especialidadesservice';

@Component({
  selector: 'app-esmedicoscomponent',
  imports: [MatButtonModule, MatCardModule, LucideSearch],
  templateUrl: './esmedicoscomponent.html',
  styleUrl: './esmedicoscomponent.css',
})
export class Esmedicoscomponent {
  especialidad: Especialidades | null = null;
  listaMedicos: MedicoPorEspecialidad[] = [];
  mensajeBusqueda = '';

  constructor(private eS: Especialidadesservice,
    private cdr: ChangeDetectorRef
  ) { }

  buscarMedicos(idValue: string): void {
    this.especialidad = null;
    this.listaMedicos = [];

    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeBusqueda = 'Ingrese un ID válido.';
      return;
    }

    // /{id}/medicos devuelve [] si la especialidad no existe, por eso primero se valida que exista
    this.eS.getEspecialidadById(id).subscribe({
      next: (especialidad) => {
        this.especialidad = especialidad;
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
        this.obtenerMedicos(especialidad);
      },
      error: (error) => {
        this.mensajeBusqueda = `No existe la especialidad: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  private obtenerMedicos(especialidad: Especialidades): void {
    this.eS.getMedicosPorEspecialidad(especialidad.idEspecialidad).subscribe({
      next: (data) => {
        this.listaMedicos = data;
        this.mensajeBusqueda = data.length === 0
          ? `La especialidad ${especialidad.nombre} no tiene doctores asignados.`
          : '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensajeBusqueda = `Error al obtener los doctores: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
