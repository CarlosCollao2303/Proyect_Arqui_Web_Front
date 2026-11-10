import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LucideCircleCheck, LucideCircleX, LucideClock3 } from '@lucide/angular';
import { Citas } from '../../../models/Citas';
import { Usuarios } from '../../../models/Usuarios';
import { Citasservice } from '../../../services/citasservice';
import { Usuariosservice } from '../../../services/usuariosservice';

@Component({
  selector: 'app-clistarcomponent',
  imports: [MatTableModule, MatPaginatorModule, LucideCircleCheck, LucideCircleX, LucideClock3],
  templateUrl: './clistarcomponent.html',
  styleUrl: './clistarcomponent.css',
})
export class Clistarcomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  dataSource = new MatTableDataSource<Citas>([]);
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator | undefined) {
    if (paginator) this.dataSource.paginator = paginator;
  }
  listaUsuarios: Usuarios[] = [];

  constructor(private cS: Citasservice,
    private uS: Usuariosservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarCitas();
    this.listarUsuarios();
  }

  listarCitas() {
    this.cS.getListCitas().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator?.firstPage();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener las citas:', err);
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

  nombreUsuario(idUsuario: number): string {
    const usuario = this.listaUsuarios.find(u => u.idUsuario === idUsuario);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : '';
  }
}
