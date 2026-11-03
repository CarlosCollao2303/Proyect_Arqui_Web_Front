import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Examenes } from '../../../models/Examenes';
import { Examenesservice } from '../../../services/examenesservice';

@Component({
  selector: 'app-elistarcomponent',
  imports: [DatePipe, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './elistarcomponent.html',
  styleUrl: './elistarcomponent.css',
})
export class Elistarcomponent implements OnInit {
  displayedColumns = ['idExamen', 'tipoExamen', 'resultado', 'fechaSolicitud', 'fechaResultado', 'acciones'];
  dataSource: Examenes[] = [];

  constructor(
    private service: Examenesservice,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.obtenerExamenes();
  }

  obtenerExamenes(): void {
    this.service.getListExamenes().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener los exámenes:', error);
        this.cdr.detectChanges();
      },
    });
  }

  eliminarExamen(id: number): void {
    this.service.deleteExamen(id).subscribe({
      next: () => this.obtenerExamenes(),
      error: (error) => console.error('Error al eliminar el examen:', error),
    });
  }
}
