import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash } from '@lucide/angular';
import { DetalleHistorial } from '../../../models/DetalleHistorial';
import { Usuarios } from '../../../models/Usuarios';
import { HistoriasClinicas } from '../../../models/HistoriasClinicas';
import { Examenes } from '../../../models/Examenes';
import { Diagnosticos } from '../../../models/Diagnosticos';
import { Tratamientos } from '../../../models/Tratamientos';
import { Recetas } from '../../../models/Recetas';
import { Detallehistorialservice } from '../../../services/detallehistorialservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Historiasclinicasservice } from '../../../services/historiasclinicasservice';
import { Examenesservice } from '../../../services/examenesservice';
import { Diagnosticosservice } from '../../../services/diagnosticosservice';
import { Tratamientosservice } from '../../../services/tratamientosservice';
import { Recetasservice } from '../../../services/recetasservice';
import { Loginservice } from '../../../services/loginservice';
import { idActualizadoDeLaNavegacion, ordenarListado } from '../../../utils/listados';

@Component({
  selector: 'app-dhlistarcomponent',
  imports: [AsyncPipe, DatePipe, MatButtonModule, MatCardModule, MatPaginatorModule, RouterLink, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash],
  templateUrl: './dhlistarcomponent.html',
  styleUrl: './dhlistarcomponent.css',
})
export class Dhlistarcomponent implements OnInit {
  dataSource = new MatTableDataSource<DetalleHistorial>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  mensajeBusqueda = '';
  // Registro recién actualizado: se muestra primero y resaltado para no perderlo.
  idActualizado = idActualizadoDeLaNavegacion();

  // Listas de las tablas foráneas, para mostrar nombres en vez de solo IDs
  listaUsuarios: Usuarios[] = [];
  listaHistorias: HistoriasClinicas[] = [];
  listaExamenes: Examenes[] = [];
  listaDiagnosticos: Diagnosticos[] = [];
  listaTratamientos: Tratamientos[] = [];
  listaRecetas: Recetas[] = [];

  constructor(
    private service: Detallehistorialservice,
    private uS: Usuariosservice,
    private hS: Historiasclinicasservice,
    private eS: Examenesservice,
    private dS: Diagnosticosservice,
    private tS: Tratamientosservice,
    private rS: Recetasservice,
    private cdr: ChangeDetectorRef,
    private loginService: Loginservice,
  ) { }

  // Solo el ADMIN puede eliminar registros: a los demás roles ni se les muestra el botón
  get esAdmin(): boolean {
    return this.loginService.hasAnyRole(['ADMIN']);
  }

  ngOnInit(): void {
    this.obtenerDetalles();
    this.cargarTablasForaneas();
  }

  cargarTablasForaneas(): void {
    this.uS.getListUsuarios().subscribe((data) => { this.listaUsuarios = data; this.cdr.detectChanges(); });
    this.hS.getListHistorias().subscribe((data) => { this.listaHistorias = data; this.cdr.detectChanges(); });
    this.eS.getListExamenes().subscribe((data) => { this.listaExamenes = data; this.cdr.detectChanges(); });
    this.dS.getListDiagnosticos().subscribe((data) => { this.listaDiagnosticos = data; this.cdr.detectChanges(); });
    this.tS.getListTratamientos().subscribe((data) => { this.listaTratamientos = data; this.cdr.detectChanges(); });
    this.rS.getListRecetas().subscribe((data) => { this.listaRecetas = data; this.cdr.detectChanges(); });
  }

  nombreUsuario(id: number): string {
    const u = this.listaUsuarios.find((x) => x.idUsuario === id);
    return u ? `${u.nombres} ${u.apellidos}` : `#${id}`;
  }

  nombrePaciente(idHistoria: number): string {
    const h = this.listaHistorias.find((x) => x.idHistoriaClinica === idHistoria);
    return h ? this.nombreUsuario(h.idPaciente) : '-';
  }

  nombreExamen(id: number | null): string {
    if (id == null) return 'Ninguno';
    return this.listaExamenes.find((x) => x.idExamen === id)?.tipoExamen ?? `#${id}`;
  }

  nombreDiagnostico(id: number | null): string {
    if (id == null) return 'Ninguno';
    const d = this.listaDiagnosticos.find((x) => x.idDiagnostico === id);
    return d ? `${d.codigoCie10} - ${d.descripcion}` : `#${id}`;
  }

  nombreTratamiento(id: number | null): string {
    if (id == null) return 'Ninguno';
    return this.listaTratamientos.find((x) => x.idTratamiento === id)?.descripcion ?? `#${id}`;
  }

  nombreReceta(id: number | null): string {
    if (id == null) return 'Ninguna';
    return this.listaRecetas.find((x) => x.idReceta === id)?.medicamento ?? `#${id}`;
  }

  obtenerDetalles(): void {
    this.mensajeBusqueda = '';
    this.service.getListDetalles().subscribe({
      next: (data) => {
        this.dataSource.data = ordenarListado(data, (d) => d.idDetalleHistorial, this.idActualizado);
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener los detalles de historial:', error);
        this.cdr.detectChanges();
      },
    });
  }

  buscarDetalle(idValue: string): void {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeBusqueda = 'Ingrese un ID válido.';
      return;
    }

    this.service.getDetalleById(id).subscribe({
      next: (detalle) => {
        this.dataSource.data = [detalle];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource.data = [];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = `No se encontró el detalle: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  eliminarDetalle(id: number): void {
    this.service.deleteDetalle(id).subscribe({
      next: () => this.obtenerDetalles(),
      error: (error) => console.error('Error al eliminar el detalle de historial:', error),
    });
  }
}
