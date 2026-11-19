import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash } from '@lucide/angular';
import { Roles } from '../../../models/Roles';
import { Rolesservice } from '../../../services/rolesservice';
import { idActualizadoDeLaNavegacion, ordenarListado } from '../../../utils/listados';

@Component({
  selector: 'app-rolistarcomponent',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatPaginatorModule, RouterLink, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash],
  templateUrl: './rolistarcomponent.html',
  styleUrl: './rolistarcomponent.css',
})
export class Rolistarcomponent implements OnInit {
  dataSource = new MatTableDataSource<Roles>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  mensajeBusqueda = '';
  // Registro recién actualizado: se muestra primero y resaltado para no perderlo.
  idActualizado = idActualizadoDeLaNavegacion();

  constructor(
    private service: Rolesservice,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles(): void {
    this.mensajeBusqueda = '';
    this.service.getListRoles().subscribe({
      next: (data) => {
        this.dataSource.data = ordenarListado(data, (r) => r.idRol, this.idActualizado);
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener los roles:', error);
        this.cdr.detectChanges();
      },
    });
  }

  buscarRol(idValue: string): void {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeBusqueda = 'Ingrese un ID válido.';
      return;
    }

    this.service.getRolById(id).subscribe({
      next: (rol) => {
        this.dataSource.data = [rol];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource.data = [];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = `No se encontró el rol: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  eliminarRol(id: number): void {
    this.service.deleteRol(id).subscribe({
      next: () => this.obtenerRoles(),
      error: (error) => {
        // El back no deja eliminar los roles del sistema ni un rol con usuarios asignados
        this.mensajeBusqueda = `No se pudo eliminar el rol: ${error.error?.message ?? error.message}`;
        console.error('Error al eliminar el rol:', error);
        this.cdr.detectChanges();
      },
    });
  }
}
