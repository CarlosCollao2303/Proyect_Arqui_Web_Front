import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistoriasClinicas } from '../../../models/HistoriasClinicas';
import { Usuarios } from '../../../models/Usuarios';
import { Roles } from '../../../models/Roles';
import { Historiasclinicasservice } from '../../../services/historiasclinicasservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Rolesservice } from '../../../services/rolesservice';

@Component({
  selector: 'app-hinsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './hinsertarcomponent.html',
  styleUrl: './hinsertarcomponent.css',
})
export class Hinsertarcomponent implements OnInit {
  formHistorias: any;
  mensaje: string = '';
  listaUsuarios: Usuarios[] = [];
  listaRoles: Roles[] = [];

  constructor(private hS: Historiasclinicasservice,
    private uS: Usuariosservice,
    private rS: Rolesservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.formHistorias = this.fb.group({
      paciente: ['', Validators.required],
      fechaCreacion: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarUsuarios();
    this.listarRoles();
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

  listarRoles() {
    this.rS.getListRoles().subscribe({
      next: (data) => {
        this.listaRoles = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener los roles:', err);
      },
    });
  }

  listaPacientes(): Usuarios[] {
    const rol = this.listaRoles.find(r => r.nombre === 'PACIENTE');
    return rol ? this.listaUsuarios.filter(u => u.idRol === rol.idRol) : [];
  }

  insertarHistoria() {
    if (this.formHistorias.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }
    const historia: HistoriasClinicas = {
      idHistoriaClinica: 0,
      idPaciente: this.formHistorias.value.paciente,
      fechaCreacion: this.formHistorias.value.fechaCreacion
    };
    this.hS.insertHistoria(historia).subscribe({
      next: () => {
        this.mensaje = 'Historia clínica registrada correctamente.';
        this.formHistorias.reset({
          fechaCreacion: new Date()
        });
      },
      error: (error) => {
        this.mensaje = `Error al registrar la historia clínica: ${error.error?.message ?? error.message}`;
      }
    });
  }
}
