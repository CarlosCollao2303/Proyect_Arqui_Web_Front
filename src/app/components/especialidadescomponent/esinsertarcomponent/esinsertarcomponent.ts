import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCircleX, LucideSave } from '@lucide/angular';
import { Especialidades } from '../../../models/Especialidades';
import { Especialidadesservice } from '../../../services/especialidadesservice';

@Component({
  selector: 'app-esinsertarcomponent',
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, RouterLink, LucideCircleX, LucideSave],
  templateUrl: './esinsertarcomponent.html',
  styleUrl: './esinsertarcomponent.css',
})
export class Esinsertarcomponent implements OnInit {
  formEspecialidades: FormGroup;
  mensaje = '';
  isEditing = false;

  constructor(
    private service: Especialidadesservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    this.formEspecialidades = this.fb.nonNullable.group({
      idEspecialidad: [0],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    // Si la ruta trae un id, estamos en modo actualizar
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.service.getEspecialidadById(id).subscribe({
        next: (especialidad) => {
          this.formEspecialidades.patchValue(especialidad);
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.mensaje = `Error al cargar la especialidad: ${error.error?.message ?? error.message}`;
          this.cdr.detectChanges();
        },
      });
    }
  }

  insertarEspecialidad(): void {
    if (this.formEspecialidades.invalid) {
      this.mensaje = 'Por favor, ingrese el nombre de la especialidad.';
      return;
    }

    const especialidad: Especialidades = {
      idEspecialidad: this.isEditing ? this.formEspecialidades.getRawValue().idEspecialidad : 0,
      nombre: this.formEspecialidades.getRawValue().nombre.trim(),
    };

    const request = this.isEditing
      ? this.service.updateEspecialidad(especialidad)
      : this.service.insertEspecialidad(especialidad);
    request.subscribe({
      next: () => {
        this.mensaje = this.isEditing
          ? 'Especialidad actualizada correctamente.'
          : 'Especialidad registrada correctamente.';
        if (!this.isEditing) {
          this.formEspecialidades.reset();
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al ${this.isEditing ? 'actualizar' : 'registrar'} la especialidad: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
