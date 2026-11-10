import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Citas } from '../../../models/Citas';
import { Usuarios } from '../../../models/Usuarios';
import { Roles } from '../../../models/Roles';
import { Citasservice } from '../../../services/citasservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Rolesservice } from '../../../services/rolesservice';

@Component({
  selector: 'app-cinsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './cinsertarcomponent.html',
  styleUrl: './cinsertarcomponent.css',
})
export class Cinsertarcomponent implements OnInit {
  formCitas: any;
  mensaje: string = '';
  listaUsuarios: Usuarios[] = [];
  listaRoles: Roles[] = [];

  constructor(private cS: Citasservice,
    private uS: Usuariosservice,
    private rS: Rolesservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.formCitas = this.fb.group({
      paciente: ['', Validators.required],
      medico: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      tiempoEspera: [0, [Validators.required, Validators.min(0)]],
      estado: ['PENDIENTE', Validators.required]
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

  usuariosPorRol(nombreRol: string): Usuarios[] {
    const rol = this.listaRoles.find(r => r.nombre === nombreRol);
    return rol ? this.listaUsuarios.filter(u => u.idRol === rol.idRol) : [];
  }

  insertarCita() {
    if (this.formCitas.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }
    const cita: Citas = {
      idCita: 0,
      idPaciente: this.formCitas.value.paciente,
      idMedico: this.formCitas.value.medico,
      fechaHoraProgramada: this.formCitas.value.fecha,
      tiempoEsperaMinutos: this.formCitas.value.tiempoEspera,
      estado: this.formCitas.value.estado
    };
    this.cS.insertCita(cita).subscribe({
      next: () => {
        this.mensaje = 'Cita registrada correctamente.';
        this.formCitas.reset({
          fecha: new Date(),
          tiempoEspera: 0,
          estado: 'PENDIENTE'
        });
      },
      error: (error) => {
        this.mensaje = `Error al registrar la cita: ${error.error?.message ?? error.message}`;
      }
    });
  }
}
