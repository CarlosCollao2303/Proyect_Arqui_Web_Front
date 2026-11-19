import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash, LucideUserCog } from '@lucide/angular';
import { Usuarios } from '../../../models/Usuarios';
import { Roles } from '../../../models/Roles';
import { Especialidades } from '../../../models/Especialidades';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Rolesservice } from '../../../services/rolesservice';
import { Especialidadesservice } from '../../../services/especialidadesservice';
import { idActualizadoDeLaNavegacion, ordenarListado } from '../../../utils/listados';

@Component({
  selector: 'app-ulistarcomponent',
  imports: [MatButtonModule, MatTableModule, MatPaginatorModule, RouterLink, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash, LucideUserCog],
  templateUrl: './ulistarcomponent.html',
  styleUrl: './ulistarcomponent.css',
})
export class Ulistarcomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'asignar', 'actualizar', 'eliminar'];
  dataSource = new MatTableDataSource<Usuarios>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  mensajeBusqueda = '';
  listaRoles: Roles[] = [];
  listaEspecialidades: Especialidades[] = [];
  // Registro recién actualizado: se muestra primero y resaltado para no perderlo.
  idActualizado = idActualizadoDeLaNavegacion();

  constructor(private uS: Usuariosservice,
    private rS: Rolesservice,
    private eS: Especialidadesservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.listarRoles();
    this.listarEspecialidades();
  }

  obtenerUsuarios() {
    this.mensajeBusqueda = '';
    this.uS.getListUsuarios().subscribe({
      next: (data) => {
        this.dataSource.data = ordenarListado(data, (u) => u.idUsuario, this.idActualizado);
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensajeBusqueda = `Error al obtener los usuarios: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  listarRoles() {
    this.rS.getListRoles().subscribe({
      next: (data) => {
        this.listaRoles = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener los roles:', err);
      },
    });
  }

  listarEspecialidades() {
    this.eS.getListEspecialidades().subscribe({
      next: (data) => {
        this.listaEspecialidades = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener las especialidades:', err);
      },
    });
  }

  buscarUsuario(idValue: string): void {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeBusqueda = 'Ingrese un ID válido.';
      return;
    }

    this.uS.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.dataSource.data = [usuario];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource.data = [];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = `No se encontró el usuario: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  nombreRol(idRol: number): string {
    return this.listaRoles.find((r) => r.idRol === idRol)?.nombre ?? '';
  }

  nombreEspecialidad(idEspecialidad: number | null): string {
    return this.listaEspecialidades.find((e) => e.idEspecialidad === idEspecialidad)?.nombre ?? 'Sin especialidad';
  }

  eliminarUsuario(id: number) {
    this.uS.deleteUsuario(id).subscribe({
      next: () => {
        this.obtenerUsuarios();
        this.cdr.detectChanges();
      },
      error: (error) => {
        // Falla si el usuario tiene citas, historias clínicas o notificaciones
        this.mensajeBusqueda = `No se pudo eliminar el usuario: ${error.error?.message ?? error.message}`;
        console.log('Error al eliminar el usuario:', error);
        this.cdr.detectChanges();
      },
    });
  }
}
