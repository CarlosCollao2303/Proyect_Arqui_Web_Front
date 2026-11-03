import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Diagnosticos } from '../../../models/Diagnosticos';
import { Diagnosticosservice } from '../../../services/diagnosticosservice';

@Component({
  selector: 'app-dinsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './dinsertarcomponent.html',
  styleUrl: './dinsertarcomponent.css',
})
export class Dinsertarcomponent {
  formDiagnosticos: FormGroup;
  mensaje = '';

  constructor(
    private service: Diagnosticosservice,
    private fb: FormBuilder,
  ) {
    this.formDiagnosticos = this.fb.nonNullable.group({
      codigoCie10: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaRegistro: [new Date(), Validators.required],
    });
  }

  insertarDiagnostico(): void {
    if (this.formDiagnosticos.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const diagnostico: Diagnosticos = {
      idDiagnostico: 0,
      ...this.formDiagnosticos.getRawValue(),
    };

    this.service.insertDiagnostico(diagnostico).subscribe({
      next: () => {
        this.mensaje = 'Diagnóstico registrado correctamente.';
        this.formDiagnosticos.reset({ fechaRegistro: new Date() });
      },
      error: (error) => {
        this.mensaje = `Error al registrar el diagnóstico: ${error.message}`;
      },
    });
  }
}
