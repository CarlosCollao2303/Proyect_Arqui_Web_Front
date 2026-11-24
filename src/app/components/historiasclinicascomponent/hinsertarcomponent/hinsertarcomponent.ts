import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCalendarDays, LucideCircleX, LucideSave } from '@lucide/angular';
import { HistoriasClinicas } from '../../../models/HistoriasClinicas';
import { Usuarios } from '../../../models/Usuarios';
import { Historiasclinicasservice } from '../../../services/historiasclinicasservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { fechaLocal } from '../../../utils/fechas';

@Component({
  selector: 'app-hinsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, RouterLink, LucideCalendarDays, LucideCircleX, LucideSave],
  templateUrl: './hinsertarcomponent.html',
  styleUrl: './hinsertarcomponent.css',
})
export class Hinsertarcomponent implements OnInit {
  formHistorias: any;
  mensaje: string = '';
  listaPacientes: Usuarios[] = [];
  isEditing = false;

  constructor(private hS: Historiasclinicasservice,
    private uS: Usuariosservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.formHistorias = this.fb.group({
      idHistoriaClinica: [0],
      paciente: ['', Validators.required],
      fechaCreacion: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarPacientes();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.hS.getHistoriaById(id).subscribe({
        next: (historia) => {
          this.formHistorias.patchValue({
            idHistoriaClinica: historia.idHistoriaClinica,
            paciente: historia.idPaciente,
            fechaCreacion: fechaLocal(historia.fechaCreacion),
          });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.mensaje = `Error al cargar la historia clínica: ${error.error?.message ?? error.message}`;
          this.cdr.detectChanges();
        },
      });
    }
  }

  // Solo los pacientes pueden tener historia clínica: el back ya los devuelve filtrados
  listarPacientes() {
    this.uS.getPacientes().subscribe({
      next: (data) => {
        this.listaPacientes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener los pacientes:', err);
      },
    });
  }

  insertarHistoria() {
    if (this.formHistorias.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }
    const historia: HistoriasClinicas = {
      idHistoriaClinica: this.isEditing ? this.formHistorias.getRawValue().idHistoriaClinica : 0,
      idPaciente: this.formHistorias.value.paciente,
      fechaCreacion: this.formHistorias.value.fechaCreacion
    };
    const request = this.isEditing
      ? this.hS.updateHistoria(historia)
      : this.hS.insertHistoria(historia);
    request.subscribe({
      next: () => {
        if (this.isEditing) {
          this.router.navigate(['/historiasclinicas/listar'], { state: { idActualizado: historia.idHistoriaClinica } });
          return;
        }
        this.mensaje = 'Historia clínica registrada correctamente.';
        this.formHistorias.reset({
          fechaCreacion: new Date()
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al ${this.isEditing ? 'actualizar' : 'registrar'} la historia clínica: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      }
    });
  }
}
