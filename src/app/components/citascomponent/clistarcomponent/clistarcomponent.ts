import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Citas } from '../../../models/Citas';
import { Usuarios } from '../../../models/Usuarios';
import { Citasservice } from '../../../services/citasservice';
import { Usuariosservice } from '../../../services/usuariosservice';

@Component({
  selector: 'app-clistarcomponent',
  imports: [MatTableModule],
  templateUrl: './clistarcomponent.html',
  styleUrl: './clistarcomponent.css',
})
export class Clistarcomponent implements OnInit {
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  dataSource: Citas[] = [];
  listaUsuarios: Usuarios[] = [];

  constructor(private cS: Citasservice,
    private uS: Usuariosservice,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarCitas();
    this.listarUsuarios();
  }

  listarCitas() {
    this.cS.getListCitas().subscribe({
      next: (data) => {
        this.dataSource = data;
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
