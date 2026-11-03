import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tratamientosservice } from '../../../services/tratamientosservice';
import { Tratamientos } from '../../../models/Tratamientos';


@Component({
  selector: 'app-tinsertarcomponent',
    providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatDatepickerModule, MatButtonModule, MatCheckboxModule, ReactiveFormsModule],
  templateUrl: './tinsertarcomponent.html',
  styleUrl: './tinsertarcomponent.css',
})
export class Tinsertarcomponent {
  formTratamientos: any;
  mensaje: string = '';

  constructor(private sT: Tratamientosservice,
    private fb: FormBuilder
  ) {
    this.formTratamientos = this.fb.group({
      descripcion: ['',Validators.required],
      fechaInicio: [new Date(),Validators.required],
      fechaFin: [new Date(),Validators.required],
      estado: [true, Validators.required]
    })
  }

  insertarTratamiento() {
    if(this.formTratamientos.invalid){
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }
    const tra: Tratamientos = {
      idTratamiento: 0,
      descripcion: this.formTratamientos.value.descripcion,
      fechaInicio: this.formTratamientos.value.fechaInicio,
      fechaFin: this.formTratamientos.value.fechaFin,
      estado: this.formTratamientos.value.estado
    }
    this.sT.insertTratamiento(tra).subscribe({
      next:(respuesta)=>{
        this.mensaje = 'Tratamiento insertado correctamente.';
        this.formTratamientos.reset({
          estado: true,
        })
      },error:(error)=>{
        this.mensaje = 'Error al insertar el tratamiento: ' + error.message;
      }
    })
  }
}
