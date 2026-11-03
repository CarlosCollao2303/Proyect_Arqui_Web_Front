import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Recetas } from '../../../models/Recetas';
import { Recetasservice } from '../../../services/recetasservice';

@Component({
  selector: 'app-rlistarcomponent',
  imports: [DatePipe, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './rlistarcomponent.html',
  styleUrl: './rlistarcomponent.css',
})
export class Rlistarcomponent implements OnInit {
  displayedColumns = [
    'idReceta',
    'medicamento',
    'dosis',
    'frecuencia',
    'duracionDias',
    'indicaciones',
    'fechaEmision',
    'acciones',
  ];
  dataSource: Recetas[] = [];

  constructor(
    private service: Recetasservice,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.obtenerRecetas();
  }

  obtenerRecetas(): void {
    this.service.getListRecetas().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener las recetas:', error);
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
