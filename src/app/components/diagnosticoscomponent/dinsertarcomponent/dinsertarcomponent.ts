import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class Dinsertarcomponent implements OnInit {
  formDiagnosticos: FormGroup;
  mensaje = '';
  isEditing = false;
  private diagnosticoId = 0;

  constructor(
    private service: Diagnosticosservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.formDiagnosticos = this.fb.nonNullable.group({
      codigoCie10: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaRegistro: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.diagnosticoId = id;
      this.service.getDiagnosticoById(id).subscribe({
        next: (diagnostico) => {
          this.formDiagnosticos.patchValue({
            ...diagnostico,
            fechaRegistro: new Date(diagnostico.fechaRegistro),
          });
        },
        error: (error) => {
          this.mensaje = `Error al cargar el diagnóstico: ${error.message}`;
        },
      });
    }
  }

  insertarDiagnostico(): void {
    if (this.formDiagnosticos.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const diagnostico: Diagnosticos = {
      idDiagnostico: this.isEditing ? this.diagnosticoId : 0,
      ...this.formDiagnosticos.getRawValue(),
    };

    const request = this.isEditing
      ? this.service.updateDiagnostico(diagnostico)
      : this.service.insertDiagnostico(diagnostico);
    request.subscribe({
      next: () => {
        this.mensaje = this.isEditing
          ? 'Diagnóstico actualizado correctamente.'
          : 'Diagnóstico registrado correctamente.';
        if (!this.isEditing) this.formDiagnosticos.reset({ fechaRegistro: new Date() });
      },
      error: (error) => {
        this.mensaje = `Error al registrar el diagnóstico: ${error.message}`;
      },
    });
  }
}
