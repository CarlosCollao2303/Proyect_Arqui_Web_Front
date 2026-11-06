import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Diagnosticos } from '../../../models/Diagnosticos';
import { Diagnosticosservice } from '../../../services/diagnosticosservice';

@Component({
  selector: 'app-dlistarcomponent',
  imports: [DatePipe, MatIconModule, MatButtonModule, MatTableModule, RouterLink],
  templateUrl: './dlistarcomponent.html',
  styleUrl: './dlistarcomponent.css',
})
export class Dlistarcomponent implements OnInit {
  displayedColumns = ['idDiagnostico', 'codigoCie10', 'descripcion', 'fechaRegistro', 'actualizar', 'eliminar'];
  dataSource: Diagnosticos[] = [];
  mensajeBusqueda = '';

  constructor(
    private service: Diagnosticosservice,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.obtenerDiagnosticos();
  }

  obtenerDiagnosticos(): void {
    this.mensajeBusqueda = '';
    this.service.getListDiagnosticos().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener los diagnósticos:', error);
        this.cdr.detectChanges();
      },
    });
  }

  buscarDiagnostico(idValue: string): void {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeBusqueda = 'Ingrese un ID válido.';
      return;
    }

    this.service.getDiagnosticoById(id).subscribe({
      next: (diagnostico) => {
        this.dataSource = [diagnostico];
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource = [];
        this.mensajeBusqueda = `No se encontró el diagnóstico: ${error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  eliminarDiagnostico(id: number): void {
    this.service.deleteDiagnostico(id).subscribe({
      next: () => this.obtenerDiagnosticos(),
      error: (error) => console.error('Error al eliminar el diagnóstico:', error),
    });
  }
}
