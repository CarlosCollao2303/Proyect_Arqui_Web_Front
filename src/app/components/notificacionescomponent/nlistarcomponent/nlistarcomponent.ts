import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { LucideMailCheck, LucideMailX, LucideTrash } from '@lucide/angular';
import { Notificaciones } from '../../../models/Notificaciones';
import { Usuarios } from '../../../models/Usuarios';
import { Notificacionesservice } from '../../../services/notificacionesservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Loginservice } from '../../../services/loginservice';

@Component({
  selector: 'app-nlistarcomponent',
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, LucideMailCheck, LucideMailX, LucideTrash],
  templateUrl: './nlistarcomponent.html',
  styleUrl: './nlistarcomponent.css',
})
export class Nlistarcomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'eliminar'];
  dataSource = new MatTableDataSource<Notificaciones>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  listaUsuarios: Usuarios[] = [];

  constructor(private nS: Notificacionesservice,
    private uS: Usuariosservice,
    private cdr: ChangeDetectorRef,
    private loginService: Loginservice
  ) { }

  // Solo el ADMIN puede eliminar registros: a los demás roles ni se les muestra el botón
  get esAdmin(): boolean {
    return this.loginService.hasAnyRole(['ADMIN']);
  }

  ngOnInit(): void {
    if (!this.esAdmin) {
      this.displayedColumns = this.displayedColumns.filter((columna) => columna !== 'eliminar');
    }
    this.listarNotificaciones();
    this.listarUsuarios();
  }

  listarNotificaciones() {
    this.nS.getListNotificaciones().subscribe({
      next: (data) => {
        // Las más recientes primero
        this.dataSource.data = [...data].sort((a, b) => b.idNotificacion - a.idNotificacion);
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener las notificaciones:', err);
      },
    });
  }

  listarUsuarios() {
    this.uS.getListUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener los usuarios:', err);
      },
    });
  }

  eliminarNotificacion(id: number) {
    this.nS.deleteNotificacion(id).subscribe({
      next: () => {
        this.listarNotificaciones();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al eliminar la notificación:', err);
      },
    });
  }

  nombreUsuario(idUsuario: number): string {
    const usuario = this.listaUsuarios.find(u => u.idUsuario === idUsuario);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : '';
  }

  correoUsuario(idUsuario: number): string {
    return this.listaUsuarios.find(u => u.idUsuario === idUsuario)?.correo ?? '';
  }
}
