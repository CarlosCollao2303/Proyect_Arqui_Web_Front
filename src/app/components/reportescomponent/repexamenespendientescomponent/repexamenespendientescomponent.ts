import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ExamenPendiente } from '../../../models/ExamenPendiente';
import { Examenesservice } from '../../../services/examenesservice';
import { fechaLocal } from '../../../utils/fechas';

@Component({
  selector: 'app-repexamenespendientescomponent',
  imports: [DatePipe, MatTableModule, MatPaginatorModule],
  templateUrl: './repexamenespendientescomponent.html',
  styleUrl: './repexamenespendientescomponent.css',
})
export class Repexamenespendientescomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];
  // Se respeta el orden del back: del más antiguo al más reciente
  dataSource = new MatTableDataSource<ExamenPendiente>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  cargando = true;
  mensaje = '';

  constructor(private eS: Examenesservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerPendientes();
  }

  obtenerPendientes() {
    this.cargando = true;
    this.mensaje = '';
    this.eS.getExamenesPendientes().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator?.firstPage();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource.data = [];
        this.cargando = false;
        this.mensaje = `Error al obtener los exámenes pendientes: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  fecha(valor: string): Date | null {
    return fechaLocal(valor);
  }

  diasEspera(fechaSolicitud: string): number {
    const solicitud = fechaLocal(fechaSolicitud);
    if (!solicitud) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    // Math.round evita desfases de una hora por cambios de horario
    return Math.max(0, Math.round((hoy.getTime() - solicitud.getTime()) / 86400000));
  }
}
