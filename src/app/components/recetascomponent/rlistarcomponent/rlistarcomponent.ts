import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash } from '@lucide/angular';
import { Recetas } from '../../../models/Recetas';
import { Recetasservice } from '../../../services/recetasservice';

@Component({
  selector: 'app-rlistarcomponent',
  imports: [AsyncPipe, DatePipe, MatButtonModule, MatCardModule, MatPaginatorModule, RouterLink, LucidePencil, LucideRefreshCw, LucideSearch, LucideTrash],
  templateUrl: './rlistarcomponent.html',
  styleUrl: './rlistarcomponent.css',
})
export class Rlistarcomponent implements OnInit {
  dataSource = new MatTableDataSource<Recetas>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  mensajeBusqueda = '';

  constructor(
    private service: Recetasservice,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.obtenerRecetas();
  }

  obtenerRecetas(): void {
    this.mensajeBusqueda = '';
    this.service.getListRecetas().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener las recetas:', error);
        this.cdr.detectChanges();
      },
    });
  }

  buscarReceta(idValue: string): void {
    const id = Number(idValue);
    if (!Number.isInteger(id) || id < 1) {
      this.mensajeBusqueda = 'Ingrese un ID válido.';
      return;
    }

    this.service.getRecetaById(id).subscribe({
      next: (receta) => {
        this.dataSource.data = [receta];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dataSource.data = [];
        this.dataSource.paginator?.firstPage();
        this.mensajeBusqueda = `No se encontró la receta: ${error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  eliminarReceta(id: number): void {
    this.service.deleteReceta(id).subscribe({
      next: () => this.obtenerRecetas(),
      error: (error) => console.error('Error al eliminar la receta:', error),
    });
  }
}
