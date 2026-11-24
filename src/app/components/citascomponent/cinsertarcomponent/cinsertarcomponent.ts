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
import { Citasservice } from '../../../services/citasservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Loginservice } from '../../../services/loginservice';
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
  listaPacientes: Usuarios[] = [];
  listaMedicos: Usuarios[] = [];
  // id del médico logueado (solo si quien registra es MÉDICO)
  idMedicoLogueado: number | null = null;
  isEditing = false;

  constructor(private cS: Citasservice,
    private uS: Usuariosservice,
    private loginService: Loginservice,
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
    this.listarPacientesYMedicos();
    if (this.esMedico) {
      this.formCitas.get('medico').disable();
      this.ponerMedicoLogueado();
    }

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


  // Un MÉDICO registra a su nombre: el campo médico se llena solo y no se puede cambiar
  get esMedico(): boolean {
    return !this.loginService.hasAnyRole(['ADMIN']) && this.loginService.hasAnyRole(['MEDICO']);
  }

  // El back ya los devuelve separados: no hace falta pedir los roles para filtrar
  listarPacientesYMedicos() {
    this.uS.getPacientes().subscribe({
      next: (data) => {
        this.listaPacientes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener los pacientes:', err);
      },
    });
    this.uS.getMedicos().subscribe({
      next: (data) => {
        this.listaMedicos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener los médicos:', err);
      },
    });
  }

  // Al registrar, el médico de la cita es el que inició sesión
  ponerMedicoLogueado() {
    this.uS.getPerfil().subscribe({
      next: (perfil) => {
        this.idMedicoLogueado = perfil.idUsuario;
        if (!this.isEditing) {
          this.formCitas.patchValue({ medico: perfil.idUsuario });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener el perfil:', err);
      },
    });
  }

  insertarCita() {
    if (this.formCitas.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }
    const cita: Citas = {
      idCita: this.isEditing ? this.formCitas.getRawValue().idCita : 0,
      idPaciente: this.formCitas.value.paciente,
      // getRawValue: el médico está deshabilitado cuando registra un MÉDICO
      idMedico: this.formCitas.getRawValue().medico,
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
          medico: this.idMedicoLogueado,
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
