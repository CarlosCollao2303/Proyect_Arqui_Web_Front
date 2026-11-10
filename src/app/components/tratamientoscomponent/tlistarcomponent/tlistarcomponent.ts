import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { LucideCircleCheck, LucideClock3, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash } from '@lucide/angular';
import { Tratamientos } from '../../../models/Tratamientos';
import { Tratamientosservice } from '../../../services/tratamientosservice';


@Component({
  selector: 'app-tlistarcomponent',
  imports: [MatButtonModule, MatTableModule, MatPaginatorModule, RouterLink, LucideCircleCheck, LucideClock3, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash],
  templateUrl: './tlistarcomponent.html',
  styleUrl: './tlistarcomponent.css',
})
export class Tlistarcomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'actualizar', 'eliminar'];
  dataSource = new MatTableDataSource<Tratamientos>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  mensajeBusqueda = '';
  constructor(private sService: Tratamientosservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerTratamientos();
  }

  obtenerTratamientos() {
    this.mensajeBusqueda = '';
    this.sService.getListTratamientos().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener los tratamientos:', err);
        this.cdr.detectChanges();
      },
    });
  }

  buscarTratamiento(idValue: string): void {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeBusqueda = 'Ingrese un ID válido.';
      return;
    }

    this.sService.getTratamientoById(id).subscribe({
      next: (tratamiento) => {
        this.dataSource.data = [tratamiento];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource.data = [];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = `No se encontró el tratamiento: ${error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  mostrarEstado(estado: string | boolean): string {
    if (estado === true) return 'Activo';
    if (estado === false) return 'Pendiente';
    return estado;
  }

  eliminarTratamiento(id: number) {
    this.sService.deleteTratamiento(id).subscribe({
      next: () => {
        this.obtenerTratamientos();
        this.cdr.detectChanges();
      }, error: err => {
        console.log('Error al eliminar el tratamiento:', err);
        this.cdr.detectChanges();
      }
    })
  }
}
