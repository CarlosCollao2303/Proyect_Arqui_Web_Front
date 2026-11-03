import { Component } from '@angular/core';
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
export class Einsertarcomponent {
  formExamenes: FormGroup;
  mensaje = '';

  constructor(
    private service: Examenesservice,
    private fb: FormBuilder,
  ) {
    this.formExamenes = this.fb.nonNullable.group({
      tipoExamen: ['', Validators.required],
      resultado: ['', Validators.required],
      fechaSolicitud: [new Date(), Validators.required],
      fechaResultado: [new Date(), Validators.required],
    });
  }

  insertarExamen(): void {
    if (this.formExamenes.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const examen: Examenes = {
      idExamen: 0,
      ...this.formExamenes.getRawValue(),
    };

    this.service.insertExamen(examen).subscribe({
      next: () => {
        this.mensaje = 'Examen registrado correctamente.';
        this.formExamenes.reset({
          fechaSolicitud: new Date(),
          fechaResultado: new Date(),
        });
      },
      error: (error) => {
        this.mensaje = `Error al registrar el examen: ${error.message}`;
      },
    });
  }
}
