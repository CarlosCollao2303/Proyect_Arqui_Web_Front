import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Diagnosticos } from '../../../models/Diagnosticos';
import { Diagnosticosservice } from '../../../services/diagnosticosservice';

@Component({
  selector: 'app-dlistarcomponent',
  imports: [DatePipe, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './dlistarcomponent.html',
  styleUrl: './dlistarcomponent.css',
})
export class Dlistarcomponent implements OnInit {
  displayedColumns = ['idDiagnostico', 'codigoCie10', 'descripcion', 'fechaRegistro', 'acciones'];
  dataSource: Diagnosticos[] = [];

  constructor(
    private service: Diagnosticosservice,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.obtenerDiagnosticos();
  }

  obtenerDiagnosticos(): void {
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

  eliminarDiagnostico(id: number): void {
    this.service.deleteDiagnostico(id).subscribe({
      next: () => this.obtenerDiagnosticos(),
      error: (error) => console.error('Error al eliminar el diagnóstico:', error),
    });
  }
}
