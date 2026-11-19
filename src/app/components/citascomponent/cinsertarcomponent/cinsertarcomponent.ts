import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCalendarDays, LucideCircleX, LucideSave } from '@lucide/angular';
import { Citas } from '../../../models/Citas';
import { Usuarios } from '../../../models/Usuarios';
import { Roles } from '../../../models/Roles';
import { Citasservice } from '../../../services/citasservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Rolesservice } from '../../../services/rolesservice';
import { fechaLocal } from '../../../utils/fechas';

@Component({
  selector: 'app-cinsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, RouterLink, LucideCalendarDays, LucideCircleX, LucideSave],
  templateUrl: './cinsertarcomponent.html',
  styleUrl: './cinsertarcomponent.css',
})
export class Cinsertarcomponent implements OnInit {
  formCitas: any;
  mensaje: string = '';
  listaUsuarios: Usuarios[] = [];
  listaRoles: Roles[] = [];
  isEditing = false;

  constructor(private cS: Citasservice,
    private uS: Usuariosservice,
    private rS: Rolesservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.formCitas = this.fb.group({
      idCita: [0],
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

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.cS.getCitaById(id).subscribe({
        next: (cita) => {
          this.formCitas.patchValue({
            idCita: cita.idCita,
            paciente: cita.idPaciente,
            medico: cita.idMedico,
            fecha: fechaLocal(cita.fechaHoraProgramada),
            tiempoEspera: cita.tiempoEsperaMinutos,
            estado: cita.estado,
          });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.mensaje = `Error al cargar la cita: ${error.error?.message ?? error.message}`;
          this.cdr.detectChanges();
        },
      });
    }
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
      idCita: this.isEditing ? this.formCitas.getRawValue().idCita : 0,
      idPaciente: this.formCitas.value.paciente,
      idMedico: this.formCitas.value.medico,
      fechaHoraProgramada: this.formCitas.value.fecha,
      tiempoEsperaMinutos: this.formCitas.value.tiempoEspera,
      estado: this.formCitas.value.estado
    };
    const request = this.isEditing
      ? this.cS.updateCita(cita)
      : this.cS.insertCita(cita);
    request.subscribe({
      next: () => {
        if (this.isEditing) {
          this.router.navigate(['/citas/listar'], { state: { idActualizado: cita.idCita } });
          return;
        }
        this.mensaje = 'Cita registrada correctamente.';
        this.formCitas.reset({
          fecha: new Date(),
          tiempoEspera: 0,
          estado: 'PENDIENTE'
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al ${this.isEditing ? 'actualizar' : 'registrar'} la cita: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      }
    });
  }
}
