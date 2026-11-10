import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCalendarDays, LucideCircleX, LucideSave } from '@lucide/angular';
import { Recetas } from '../../../models/Recetas';
import { Recetasservice } from '../../../services/recetasservice';

@Component({
  selector: 'app-rinsertarcomponent',
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, ReactiveFormsModule, RouterLink, LucideCalendarDays, LucideCircleX, LucideSave],
  templateUrl: './rinsertarcomponent.html',
  styleUrl: './rinsertarcomponent.css',
})
export class Rinsertarcomponent implements OnInit {
  formRecetas: FormGroup;
  mensaje = '';
  isEditing = false;

  constructor(
    private service: Recetasservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.formRecetas = this.fb.nonNullable.group({
      idReceta: [0],
      medicamento: ['', Validators.required],
      dosis: ['', Validators.required],
      frecuencia: ['', Validators.required],
      duracionDias: [1, [Validators.required, Validators.min(1)]],
      indicaciones: ['', Validators.required],
      fechaEmision: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.service.getRecetaById(id).subscribe({
        next: (receta) => {
          this.formRecetas.patchValue({
            ...receta,
            fechaEmision: new Date(receta.fechaEmision),
          });
        },
        error: (error) => {
          this.mensaje = `Error al cargar la receta: ${error.message}`;
        },
      });
    }
  }

  insertarReceta(): void {
    if (this.formRecetas.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const receta: Recetas = {
      idReceta: this.isEditing ? this.formRecetas.getRawValue().idReceta : 0,
      ...this.formRecetas.getRawValue(),
    };

    const request = this.isEditing
      ? this.service.updateReceta(receta)
      : this.service.insertReceta(receta);
    request.subscribe({
      next: () => {
        this.mensaje = this.isEditing
          ? 'Receta actualizada correctamente.'
          : 'Receta registrada correctamente.';
        if (!this.isEditing) {
          this.formRecetas.reset({ duracionDias: 1, fechaEmision: new Date() });
        }
      },
      error: (error) => {
        this.mensaje = `Error al registrar la receta: ${error.message}`;
      },
    });
  }
}
