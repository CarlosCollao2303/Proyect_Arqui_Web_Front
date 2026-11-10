import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { LucideEye, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash } from '@lucide/angular';
import { Diagnosticos } from '../../../models/Diagnosticos';
import { Diagnosticosservice } from '../../../services/diagnosticosservice';

@Component({
  selector: 'app-dlistarcomponent',
  imports: [DatePipe, MatButtonModule, MatTableModule, MatPaginatorModule, RouterLink, LucideEye, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash],
  templateUrl: './dlistarcomponent.html',
  styleUrl: './dlistarcomponent.css',
})
export class Dlistarcomponent implements OnInit {
  displayedColumns = ['idDiagnostico', 'codigoCie10', 'descripcion', 'fechaRegistro', 'detalle', 'actualizar', 'eliminar'];
  dataSource = new MatTableDataSource<Diagnosticos>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  mensajeBusqueda = '';

  constructor(
    private service: Diagnosticosservice,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.obtenerDiagnosticos();
  }

  obtenerDiagnosticos(): void {
    this.mensajeBusqueda = '';
    this.service.getListDiagnosticos().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator?.firstPage();
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
        this.dataSource.data = [diagnostico];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource.data = [];
        this.dataSource.paginator?.firstPage();
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
