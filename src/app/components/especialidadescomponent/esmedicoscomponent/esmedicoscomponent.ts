import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LucideStethoscope } from '@lucide/angular';
import { Especialidades } from '../../../models/Especialidades';
import { MedicoPorEspecialidad } from '../../../models/MedicoPorEspecialidad';
import { Especialidadesservice } from '../../../services/especialidadesservice';

@Component({
  selector: 'app-esmedicoscomponent',
  imports: [MatCardModule, MatFormFieldModule, MatSelectModule, LucideStethoscope],
  templateUrl: './esmedicoscomponent.html',
  styleUrl: './esmedicoscomponent.css',
})
export class Esmedicoscomponent implements OnInit {
  // 0 = todas las especialidades
  especialidadSeleccionada = 0;
  // Solo las especialidades que tienen médicos disponibles
  especialidades: Especialidades[] = [];
  listaMedicos: MedicoPorEspecialidad[] = [];
  mensaje = '';

  constructor(private eS: Especialidadesservice,
    private cdr: ChangeDetectorRef
  ) { }

  // Al entrar se ven todos los médicos; el desplegable sirve para filtrarlos
  ngOnInit(): void {
    this.listarEspecialidades();
    this.mostrarTodos();
  }

  listarEspecialidades(): void {
    this.eS.getEspecialidadesConMedicos().subscribe({
      next: (data) => {
        this.especialidades = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener las especialidades:', error);
      },
    });
  }

  filtrarPorEspecialidad(idEspecialidad: number): void {
    this.especialidadSeleccionada = idEspecialidad;
    if (idEspecialidad === 0) {
      this.mostrarTodos();
      return;
    }

    this.mensaje = 'Buscando...';
    this.eS.getMedicosPorEspecialidad(idEspecialidad).subscribe({
      next: (data) => this.mostrar(data),
      error: (error) => this.mostrarError(error),
    });
  }

  private mostrarTodos(): void {
    this.mensaje = 'Buscando...';
    this.eS.getTodosLosMedicos().subscribe({
      next: (data) => this.mostrar(data),
      error: (error) => this.mostrarError(error),
    });
  }

  private mostrar(data: MedicoPorEspecialidad[]): void {
    this.listaMedicos = data;
    this.mensaje = data.length === 0 ? 'No hay médicos disponibles en esta especialidad.' : '';
    this.cdr.detectChanges();
  }

  private mostrarError(error: any): void {
    this.listaMedicos = [];
    this.mensaje = `Error al obtener los médicos: ${error.error?.message ?? error.message}`;
    this.cdr.detectChanges();
  }
}
