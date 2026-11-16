import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCalendarDays, LucideCircleX, LucideSave } from '@lucide/angular';
import { DetalleHistorial } from '../../../models/DetalleHistorial';
import { Usuarios } from '../../../models/Usuarios';
import { Roles } from '../../../models/Roles';
import { HistoriasClinicas } from '../../../models/HistoriasClinicas';
import { Examenes } from '../../../models/Examenes';
import { Diagnosticos } from '../../../models/Diagnosticos';
import { Tratamientos } from '../../../models/Tratamientos';
import { Recetas } from '../../../models/Recetas';
import { Detallehistorialservice } from '../../../services/detallehistorialservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Rolesservice } from '../../../services/rolesservice';
import { Historiasclinicasservice } from '../../../services/historiasclinicasservice';
import { Examenesservice } from '../../../services/examenesservice';
import { Diagnosticosservice } from '../../../services/diagnosticosservice';
import { Tratamientosservice } from '../../../services/tratamientosservice';
import { Recetasservice } from '../../../services/recetasservice';

@Component({
  selector: 'app-dhinsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, RouterLink, LucideCalendarDays, LucideCircleX, LucideSave],
  templateUrl: './dhinsertarcomponent.html',
  styleUrl: './dhinsertarcomponent.css',
})
export class Dhinsertarcomponent implements OnInit {
  formDetalle: FormGroup;
  mensaje = '';
  isEditing = false;

  // Listas para llenar los mat-select (tablas foráneas)
  listaUsuarios: Usuarios[] = [];
  listaRoles: Roles[] = [];
  listaHistorias: HistoriasClinicas[] = [];
  listaExamenes: Examenes[] = [];
  listaDiagnosticos: Diagnosticos[] = [];
  listaTratamientos: Tratamientos[] = [];
  listaRecetas: Recetas[] = [];

  constructor(
    private service: Detallehistorialservice,
    private uS: Usuariosservice,
    private rolS: Rolesservice,
    private hS: Historiasclinicasservice,
    private eS: Examenesservice,
    private dS: Diagnosticosservice,
    private tS: Tratamientosservice,
    private rS: Recetasservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    this.formDetalle = this.fb.group({
      idDetalleHistorial: [0],
      historia: [null, Validators.required],     // obligatoria
      medico: [null, Validators.required],       // obligatoria
      examen: [null],                            // opcional
      diagnostico: [null],                       // opcional
      tratamiento: [null],                       // opcional
      receta: [null],                            // opcional
      motivoConsulta: ['', Validators.required],
      cifradoDatos: [''],
      fechaRegistro: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarTablasForaneas();

    // Si la ruta trae un id, estamos en modo actualizar
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.service.getDetalleById(id).subscribe({
        next: (d) => {
          this.formDetalle.patchValue({
            idDetalleHistorial: d.idDetalleHistorial,
            historia: d.idHistoriaClinica,
            medico: d.idMedico,
            examen: d.idExamen,
            diagnostico: d.idDiagnostico,
            tratamiento: d.idTratamiento,
            receta: d.idReceta,
            motivoConsulta: d.motivoConsulta,
            cifradoDatos: d.cifradoDatos,
            fechaRegistro: d.fechaRegistro ? new Date(`${d.fechaRegistro}T00:00:00`) : new Date(),
          });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.mensaje = `Error al cargar el detalle: ${error.error?.message ?? error.message}`;
        },
      });
    }
  }

  cargarTablasForaneas(): void {
    this.uS.getListUsuarios().subscribe((data) => { this.listaUsuarios = data; this.cdr.detectChanges(); });
    this.rolS.getListRoles().subscribe((data) => { this.listaRoles = data; this.cdr.detectChanges(); });
    this.hS.getListHistorias().subscribe((data) => { this.listaHistorias = data; this.cdr.detectChanges(); });
    this.eS.getListExamenes().subscribe((data) => { this.listaExamenes = data; this.cdr.detectChanges(); });
    this.dS.getListDiagnosticos().subscribe((data) => { this.listaDiagnosticos = data; this.cdr.detectChanges(); });
    this.tS.getListTratamientos().subscribe((data) => { this.listaTratamientos = data; this.cdr.detectChanges(); });
    this.rS.getListRecetas().subscribe((data) => { this.listaRecetas = data; this.cdr.detectChanges(); });
  }

  // El backend solo acepta usuarios con rol MEDICO
  medicos(): Usuarios[] {
    const rol = this.listaRoles.find((r) => r.nombre === 'MEDICO');
    return rol ? this.listaUsuarios.filter((u) => u.idRol === rol.idRol) : [];
  }

  nombrePaciente(idPaciente: number): string {
    const u = this.listaUsuarios.find((x) => x.idUsuario === idPaciente);
    return u ? `${u.nombres} ${u.apellidos}` : `Paciente #${idPaciente}`;
  }

  insertarDetalle(): void {
    if (this.formDetalle.invalid) {
      this.formDetalle.markAllAsTouched();
      this.mensaje = 'Por favor, complete los campos obligatorios (historia, médico, motivo y fecha).';
      return;
    }

    const v = this.formDetalle.value;
    const detalle: DetalleHistorial = {
      idDetalleHistorial: this.isEditing ? v.idDetalleHistorial : 0,
      idHistoriaClinica: v.historia,
      idMedico: v.medico,
      idExamen: v.examen ?? null,
      idDiagnostico: v.diagnostico ?? null,
      idTratamiento: v.tratamiento ?? null,
      idReceta: v.receta ?? null,
      motivoConsulta: v.motivoConsulta.trim(),
      cifradoDatos: v.cifradoDatos,
      fechaRegistro: v.fechaRegistro,
    };

    const request = this.isEditing
      ? this.service.updateDetalle(detalle)
      : this.service.insertDetalle(detalle);
    request.subscribe({
      next: () => {
        this.mensaje = this.isEditing
          ? 'Detalle de historial actualizado correctamente.'
          : 'Detalle de historial registrado correctamente.';
        if (!this.isEditing) {
          this.formDetalle.reset({ idDetalleHistorial: 0, fechaRegistro: new Date(), cifradoDatos: '' });
        }
      },
      error: (error) => {
        this.mensaje = `Error al guardar el detalle: ${error.error?.message ?? error.message}`;
      },
    });
  }
}
