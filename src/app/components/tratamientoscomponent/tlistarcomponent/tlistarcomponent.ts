import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button'
import { MatTableModule } from '@angular/material/table';
import { Tratamientos } from '../../../models/Tratamientos';
import { Tratamientosservice } from '../../../services/tratamientosservice';


@Component({
  selector: 'app-tlistarcomponent',
  imports: [MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './tlistarcomponent.html',
  styleUrl: './tlistarcomponent.css',
})
export class Tlistarcomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];
  dataSource: Tratamientos[] = [];
  constructor(private sService: Tratamientosservice,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerTratamientos();
  }

  obtenerTratamientos() {
    this.sService.getListTratamientos().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.cdr.detectChanges();
      },error: err =>{
        console.log('Error al obtener los tratamientos:', err);
        this.cdr.detectChanges();
      }
    })
  }
  eliminarTratamiento(id: number) {
    this.sService.deleteTratamiento(id).subscribe({
      next: () => {
        this.obtenerTratamientos();
        this.cdr.detectChanges();
      },error: err =>{
        console.log('Error al eliminar el tratamiento:', err);
        this.cdr.detectChanges();
      }
    })
  }
}
