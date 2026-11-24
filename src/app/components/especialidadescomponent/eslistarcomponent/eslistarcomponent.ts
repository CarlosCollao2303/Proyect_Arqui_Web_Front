import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash } from '@lucide/angular';
import { Especialidades } from '../../../models/Especialidades';
import { Especialidadesservice } from '../../../services/especialidadesservice';
import { Loginservice } from '../../../services/loginservice';
import { idActualizadoDeLaNavegacion, ordenarListado } from '../../../utils/listados';

@Component({
  selector: 'app-eslistarcomponent',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatPaginatorModule, RouterLink, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash],
  templateUrl: './eslistarcomponent.html',
  styleUrl: './eslistarcomponent.css',
})
export class Eslistarcomponent implements OnInit {
  dataSource = new MatTableDataSource<Especialidades>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  mensajeBusqueda = '';
  // Registro recién actualizado: se muestra primero y resaltado para no perderlo.
  idActualizado = idActualizadoDeLaNavegacion();

  constructor(
    private service: Especialidadesservice,
    private cdr: ChangeDetectorRef,
    private loginService: Loginservice,
  ) { }

  // Solo el ADMIN puede eliminar registros: a los demás roles ni se les muestra el botón
  get esAdmin(): boolean {
    return this.loginService.hasAnyRole(['ADMIN']);
  }

  ngOnInit(): void {
    this.obtenerEspecialidades();
  }

  obtenerEspecialidades(): void {
    this.mensajeBusqueda = '';
    this.service.getListEspecialidades().subscribe({
      next: (data) => {
        this.dataSource.data = ordenarListado(data, (e) => e.idEspecialidad, this.idActualizado);
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener las especialidades:', error);
        this.cdr.detectChanges();
      },
    });
  }

  buscarEspecialidad(nombre: string): void {
    if (!nombre.trim()) {
      this.mensajeBusqueda = 'Escriba el nombre de la especialidad.';
      return;
    }

    this.service.buscarEspecialidades(nombre.trim()).subscribe({
      next: (especialidades) => {
        this.dataSource.data = especialidades;
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = especialidades.length === 0 ? 'No se encontraron especialidades con ese nombre.' : '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource.data = [];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = `No se encontró la especialidad: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  eliminarEspecialidad(id: number): void {
    this.service.deleteEspecialidad(id).subscribe({
      next: () => this.obtenerEspecialidades(),
      error: (error) => {
        // Si hay médicos con esta especialidad, la BD no deja eliminarla (llave foránea)
        this.mensajeBusqueda = 'No se pudo eliminar: la especialidad puede estar asignada a un médico.';
        console.error('Error al eliminar la especialidad:', error);
        this.cdr.detectChanges();
      },
    });
  }
}
