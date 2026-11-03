import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recetas } from '../../../models/Recetas';
import { Recetasservice } from '../../../services/recetasservice';

@Component({
  selector: 'app-rinsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './rinsertarcomponent.html',
  styleUrl: './rinsertarcomponent.css',
})
export class Rinsertarcomponent {
  formRecetas: FormGroup;
  mensaje = '';

  constructor(
    private service: Recetasservice,
    private fb: FormBuilder,
  ) {
    this.formRecetas = this.fb.nonNullable.group({
      medicamento: ['', Validators.required],
      dosis: ['', Validators.required],
      frecuencia: ['', Validators.required],
      duracionDias: [1, [Validators.required, Validators.min(1)]],
      indicaciones: ['', Validators.required],
      fechaEmision: [new Date(), Validators.required],
    });
  }

  insertarReceta(): void {
    if (this.formRecetas.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const receta: Recetas = {
      idReceta: 0,
      ...this.formRecetas.getRawValue(),
    };

    this.service.insertReceta(receta).subscribe({
      next: () => {
        this.mensaje = 'Receta registrada correctamente.';
        this.formRecetas.reset({ duracionDias: 1, fechaEmision: new Date() });
      },
      error: (error) => {
        this.mensaje = `Error al registrar la receta: ${error.message}`;
      },
    });
  }
}
