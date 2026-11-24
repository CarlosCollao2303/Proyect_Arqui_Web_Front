import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash, LucideUserCog, LucideUsers, LucideUserRoundCheck } from '@lucide/angular';
import { Usuarios } from '../../../models/Usuarios';
import { Roles } from '../../../models/Roles';
import { Especialidades } from '../../../models/Especialidades';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Rolesservice } from '../../../services/rolesservice';
import { Especialidadesservice } from '../../../services/especialidadesservice';
import { Loginservice } from '../../../services/loginservice';
import { idActualizadoDeLaNavegacion, ordenarListado } from '../../../utils/listados';

@Component({
  selector: 'app-ulistarcomponent',
  imports: [MatButtonModule, MatTableModule, MatPaginatorModule, RouterLink, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash, LucideUserCog, LucideUsers, LucideUserRoundCheck],
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
  // Solo para el médico: false = sus pacientes (con citas con él), true = todos los pacientes
  verTodosLosPacientes = false;
  listaRoles: Roles[] = [];
  listaEspecialidades: Especialidades[] = [];
  // Registro recién actualizado: se muestra primero y resaltado para no perderlo.
  idActualizado = idActualizadoDeLaNavegacion();

  constructor(private uS: Usuariosservice,
    private rS: Rolesservice,
    private eS: Especialidadesservice,
    private cdr: ChangeDetectorRef,
    private loginService: Loginservice
  ) { }

  // Solo el ADMIN puede eliminar registros: a los demás roles ni se les muestra el botón
  get esAdmin(): boolean {
    return this.loginService.hasAnyRole(['ADMIN']);
  }

  // El médico solo trabaja con pacientes: no ve médicos ni administradores
  get esMedico(): boolean {
    return !this.esAdmin && this.loginService.hasAnyRole(['MEDICO']);
  }

  ngOnInit(): void {
    if (!this.esAdmin) {
      this.displayedColumns = this.displayedColumns.filter((columna) => columna !== 'eliminar');
    }
    if (this.esMedico) {
      // Rol y especialidad sobran (todos son pacientes) y asignar/actualizar son solo del ADMIN
      const soloAdmin = ['c7', 'c8', 'asignar', 'actualizar'];
      this.displayedColumns = this.displayedColumns.filter((columna) => !soloAdmin.includes(columna));
    } else {
      this.listarRoles();
      this.listarEspecialidades();
    }
    this.obtenerUsuarios();
  }

  cambiarVista(todos: boolean): void {
    if (this.verTodosLosPacientes === todos) return;
    this.verTodosLosPacientes = todos;
    this.obtenerUsuarios();
  }

  // ADMIN: todos los usuarios. MÉDICO: sus pacientes o todos los pacientes.
  private listaSegunRol() {
    if (!this.esMedico) return this.uS.getListUsuarios();
    return this.verTodosLosPacientes ? this.uS.getPacientes() : this.uS.getMisPacientes();
  }

  obtenerUsuarios() {
    this.mensajeBusqueda = '';
    this.listaSegunRol().subscribe({
      next: (data) => {
        this.dataSource.data = ordenarListado(data, (u) => u.idUsuario, this.idActualizado);
        this.dataSource.paginator?.firstPage();
        if (this.esMedico && !this.verTodosLosPacientes && data.length === 0) {
          this.mensajeBusqueda = 'Todavía no tienes pacientes con citas asignadas.';
        }
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

  // Busca por nombre o por DNI; al médico el back solo le devuelve pacientes
  buscarUsuario(texto: string): void {
    if (!texto.trim()) {
      this.mensajeBusqueda = 'Escriba un nombre o un DNI.';
      return;
    }

    this.uS.buscarUsuarios(texto.trim()).subscribe({
      next: (usuarios) => {
        this.dataSource.data = usuarios;
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = usuarios.length === 0 ? 'No se encontraron usuarios con ese nombre o DNI.' : '';
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
