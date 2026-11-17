import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCalendarDays, LucideCircleX, LucideSave } from '@lucide/angular';
import { Examenes } from '../../../models/Examenes';
import { Examenesservice } from '../../../services/examenesservice';
import { fechaLocal } from '../../../utils/fechas';

@Component({
  selector: 'app-einsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, ReactiveFormsModule, RouterLink, LucideCalendarDays, LucideCircleX, LucideSave],
  templateUrl: './einsertarcomponent.html',
  styleUrl: './einsertarcomponent.css',
})
export class Einsertarcomponent implements OnInit {
  formExamenes: FormGroup;
  mensaje = '';
  isEditing = false;

  constructor(
    private service: Examenesservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.formExamenes = this.fb.nonNullable.group({
      idExamen: [0],
      tipoExamen: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaSolicitud: [new Date(), Validators.required],
      // Opcional: vacío = examen pendiente (el back acepta null).
      fechaResultado: [null as Date | null],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.service.getExamenById(id).subscribe({
        next: (examen) => {
          this.formExamenes.patchValue({
            ...examen,
            fechaSolicitud: fechaLocal(examen.fechaSolicitud),
            fechaResultado: fechaLocal(examen.fechaResultado),
          });
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.mensaje = `Error al cargar el examen: ${error.error?.message ?? error.message}`;
          this.cdr.detectChanges();
        },
      });
    }
  }

  insertarExamen(): void {
    if (this.formExamenes.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const examen: Examenes = {
      idExamen: this.isEditing ? this.formExamenes.getRawValue().idExamen : 0,
      ...this.formExamenes.getRawValue(),
    };

    const request = this.isEditing
      ? this.service.updateExamen(examen)
      : this.service.insertExamen(examen);
    request.subscribe({
      next: () => {
        if (this.isEditing) {
          this.router.navigate(['/examenes/listar']);
          return;
        }
        this.mensaje = 'Examen registrado correctamente.';
        this.formExamenes.reset({
          fechaSolicitud: new Date(),
          fechaResultado: null,
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al ${this.isEditing ? 'actualizar' : 'registrar'} el examen: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
