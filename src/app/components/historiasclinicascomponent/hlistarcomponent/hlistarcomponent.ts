import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HistoriasClinicas } from '../../../models/HistoriasClinicas';
import { Usuarios } from '../../../models/Usuarios';
import { Historiasclinicasservice } from '../../../services/historiasclinicasservice';
import { Usuariosservice } from '../../../services/usuariosservice';

@Component({
  selector: 'app-hlistarcomponent',
  imports: [MatTableModule],
  templateUrl: './hlistarcomponent.html',
  styleUrl: './hlistarcomponent.css',
})
export class Hlistarcomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];
  dataSource: HistoriasClinicas[] = [];
  listaUsuarios: Usuarios[] = [];

  constructor(private hS: Historiasclinicasservice,
    private uS: Usuariosservice,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarHistorias();
    this.listarUsuarios();
  }

  listarHistorias() {
    this.hS.getListHistorias().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener las historias clínicas:', err);
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

  buscarPaciente(idPaciente: number): Usuarios | undefined {
    return this.listaUsuarios.find(u => u.idUsuario === idPaciente);
  }
}
