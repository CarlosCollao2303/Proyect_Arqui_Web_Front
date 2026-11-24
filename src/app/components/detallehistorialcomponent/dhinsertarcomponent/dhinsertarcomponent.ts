import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCalendarDays, LucideCircleX, LucideSave } from '@lucide/angular';
import { DetalleHistorial } from '../../../models/DetalleHistorial';
import { Usuarios } from '../../../models/Usuarios';
import { HistoriasClinicas } from '../../../models/HistoriasClinicas';
import { Examenes } from '../../../models/Examenes';
import { Diagnosticos } from '../../../models/Diagnosticos';
import { Tratamientos } from '../../../models/Tratamientos';
import { Recetas } from '../../../models/Recetas';
import { Detallehistorialservice } from '../../../services/detallehistorialservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Loginservice } from '../../../services/loginservice';
import { Historiasclinicasservice } from '../../../services/historiasclinicasservice';
import { Examenesservice } from '../../../services/examenesservice';
import { Diagnosticosservice } from '../../../services/diagnosticosservice';
import { Tratamientosservice } from '../../../services/tratamientosservice';
import { Recetasservice } from '../../../services/recetasservice';
import { fechaLocal } from '../../../utils/fechas';

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
  listaPacientes: Usuarios[] = [];
  listaMedicos: Usuarios[] = [];
  // id del médico logueado (solo si quien registra es MÉDICO)
  idMedicoLogueado: number | null = null;
  listaHistorias: HistoriasClinicas[] = [];
  listaExamenes: Examenes[] = [];
  listaDiagnosticos: Diagnosticos[] = [];
  listaTratamientos: Tratamientos[] = [];
  listaRecetas: Recetas[] = [];

  constructor(
    private service: Detallehistorialservice,
    private uS: Usuariosservice,
    private loginService: Loginservice,
    private hS: Historiasclinicasservice,
    private eS: Examenesservice,
    private dS: Diagnosticosservice,
    private tS: Tratamientosservice,
    private rS: Recetasservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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
    if (this.esMedico) {
      this.formDetalle.get('medico')?.disable();
      this.ponerMedicoLogueado();
    }

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
            fechaRegistro: fechaLocal(d.fechaRegistro) ?? new Date(),
          });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.mensaje = `Error al cargar el detalle: ${error.error?.message ?? error.message}`;
          this.cdr.detectChanges();
        },
      });
    }
  }

  cargarTablasForaneas(): void {
    this.uS.getPacientes().subscribe((data) => { this.listaPacientes = data; this.cdr.detectChanges(); });
    this.uS.getMedicos().subscribe((data) => { this.listaMedicos = data; this.cdr.detectChanges(); });
    this.hS.getListHistorias().subscribe((data) => { this.listaHistorias = data; this.cdr.detectChanges(); });
    this.eS.getListExamenes().subscribe((data) => { this.listaExamenes = data; this.cdr.detectChanges(); });
    this.dS.getListDiagnosticos().subscribe((data) => { this.listaDiagnosticos = data; this.cdr.detectChanges(); });
    this.tS.getListTratamientos().subscribe((data) => { this.listaTratamientos = data; this.cdr.detectChanges(); });
    this.rS.getListRecetas().subscribe((data) => { this.listaRecetas = data; this.cdr.detectChanges(); });
  }


  // Un MÉDICO registra a su nombre: el campo médico se llena solo y no se puede cambiar
  get esMedico(): boolean {
    return !this.loginService.hasAnyRole(['ADMIN']) && this.loginService.hasAnyRole(['MEDICO']);
  }

  // Al registrar, el detalle queda a nombre del médico que inició sesión
  ponerMedicoLogueado(): void {
    this.uS.getPerfil().subscribe({
      next: (perfil) => {
        this.idMedicoLogueado = perfil.idUsuario;
        if (!this.isEditing) {
          this.formDetalle.patchValue({ medico: perfil.idUsuario });
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.log('Error al obtener el perfil:', err),
    });
  }

  nombrePaciente(idPaciente: number): string {
    const u = this.listaPacientes.find((x) => x.idUsuario === idPaciente);
    return u ? `${u.nombres} ${u.apellidos}` : `Paciente #${idPaciente}`;
  }

  insertarDetalle(): void {
    if (this.formDetalle.invalid) {
      this.formDetalle.markAllAsTouched();
      this.mensaje = 'Por favor, complete los campos obligatorios (historia, médico, motivo y fecha).';
      return;
    }

    // getRawValue: el médico está deshabilitado cuando registra un MÉDICO
    const v = this.formDetalle.getRawValue();
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
        if (this.isEditing) {
          this.router.navigate(['/detallehistorial/listar'], { state: { idActualizado: detalle.idDetalleHistorial } });
          return;
        }
        this.mensaje = 'Detalle de historial registrado correctamente.';
        this.formDetalle.reset({ idDetalleHistorial: 0, medico: this.idMedicoLogueado, fechaRegistro: new Date(), cifradoDatos: '' });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al ${this.isEditing ? 'actualizar' : 'registrar'} el detalle: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
