import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tratamientosservice } from '../../../services/tratamientosservice';
import { Tratamientos } from '../../../models/Tratamientos';


@Component({
  selector: 'app-tinsertarcomponent',
    providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, RouterLink],
  templateUrl: './tinsertarcomponent.html',
  styleUrl: './tinsertarcomponent.css',
})
export class Tinsertarcomponent implements OnInit {
  formTratamientos: any;
  mensaje: string = '';
  isEditing = false;

  constructor(private sT: Tratamientosservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.formTratamientos = this.fb.group({
      idTratamiento: [0],
      descripcion: ['',Validators.required],
      fechaInicio: [new Date(),Validators.required],
      fechaFin: [new Date(),Validators.required],
      estado: ['Activo', Validators.required]
    })
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.isEditing = true;
      this.sT.getTratamientoById(id).subscribe({
        next: (tratamiento) => {
          this.formTratamientos.patchValue({
            ...tratamiento,
            fechaInicio: new Date(tratamiento.fechaInicio),
            fechaFin: new Date(tratamiento.fechaFin),
            estado: this.normalizarEstado(tratamiento.estado),
          });
        },
        error: (error) => {
          this.mensaje = `Error al cargar el tratamiento: ${error.message}`;
        },
      });
    }
  }

  insertarTratamiento() {
    if(this.formTratamientos.invalid){
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }
    const tra: Tratamientos = {
      idTratamiento: this.isEditing ? this.formTratamientos.getRawValue().idTratamiento : 0,
      descripcion: this.formTratamientos.value.descripcion,
      fechaInicio: this.formTratamientos.value.fechaInicio,
      fechaFin: this.formTratamientos.value.fechaFin,
      estado: this.formTratamientos.value.estado
    }
    const request = this.isEditing
      ? this.sT.updateTratamiento(tra)
      : this.sT.insertTratamiento(tra);
    request.subscribe({
      next:(respuesta)=>{
        this.mensaje = this.isEditing
          ? 'Tratamiento actualizado correctamente.'
          : 'Tratamiento insertado correctamente.';
        if (this.isEditing) return;
        this.formTratamientos.reset({
          estado: 'Activo',
        })
      },error:(error)=>{
        this.mensaje = `Error al ${this.isEditing ? 'actualizar' : 'insertar'} el tratamiento: ${error.message}`;
      }
    })
  }

  private normalizarEstado(estado: string | boolean): string {
    if (estado === true) return 'Activo';
    if (estado === false) return 'Pendiente';
    return estado;
  }
}
