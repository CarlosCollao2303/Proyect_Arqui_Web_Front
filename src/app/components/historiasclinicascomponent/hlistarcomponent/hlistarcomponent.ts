import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HistoriasClinicas } from '../../../models/HistoriasClinicas';
import { Usuarios } from '../../../models/Usuarios';
import { Historiasclinicasservice } from '../../../services/historiasclinicasservice';
import { Usuariosservice } from '../../../services/usuariosservice';

@Component({
  selector: 'app-hlistarcomponent',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './hlistarcomponent.html',
  styleUrl: './hlistarcomponent.css',
})
export class Hlistarcomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];
  dataSource = new MatTableDataSource<HistoriasClinicas>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
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
        this.dataSource.data = data;
        this.dataSource.paginator?.firstPage();
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
