import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Examenes } from '../../../models/Examenes';
import { Examenesservice } from '../../../services/examenesservice';

@Component({
  selector: 'app-einsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './einsertarcomponent.html',
  styleUrl: './einsertarcomponent.css',
})
export class Einsertarcomponent implements OnInit {
  formExamenes: FormGroup;
  mensaje = '';
  isEditing = false;
  private examenId = 0;

  constructor(
    private service: Examenesservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.formExamenes = this.fb.nonNullable.group({
      tipoExamen: ['', Validators.required],
      resultado: ['', Validators.required],
      fechaSolicitud: [new Date(), Validators.required],
      fechaResultado: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.examenId = id;
      this.service.getExamenById(id).subscribe({
        next: (examen) => {
          this.formExamenes.patchValue({
            ...examen,
            fechaSolicitud: new Date(examen.fechaSolicitud),
            fechaResultado: new Date(examen.fechaResultado),
          });
        },
        error: (error) => {
          this.mensaje = `Error al cargar el examen: ${error.message}`;
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
      idExamen: this.isEditing ? this.examenId : 0,
      ...this.formExamenes.getRawValue(),
    };

    const request = this.isEditing
      ? this.service.updateExamen(examen)
      : this.service.insertExamen(examen);
    request.subscribe({
      next: () => {
        this.mensaje = this.isEditing
          ? 'Examen actualizado correctamente.'
          : 'Examen registrado correctamente.';
        if (!this.isEditing) {
          this.formExamenes.reset({
            fechaSolicitud: new Date(),
            fechaResultado: new Date(),
          });
        }
      },
      error: (error) => {
        this.mensaje = `Error al registrar el examen: ${error.message}`;
      },
    });
  }
}
