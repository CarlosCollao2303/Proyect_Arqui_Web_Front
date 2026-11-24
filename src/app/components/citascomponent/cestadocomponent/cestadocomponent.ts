import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { LucideCircleCheck, LucideCircleX, LucideClock3, LucideVideo } from '@lucide/angular';
import { CitaEstado } from '../../../models/CitaEstado';
import { Usuarios } from '../../../models/Usuarios';
import { Citasservice } from '../../../services/citasservice';
import { Usuariosservice } from '../../../services/usuariosservice';
import { Loginservice } from '../../../services/loginservice';
import { fechaLocal } from '../../../utils/fechas';

@Component({
  selector: 'app-cestadocomponent',
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    LucideCircleCheck, LucideCircleX, LucideClock3, LucideVideo],
  templateUrl: './cestadocomponent.html',
  styleUrl: './cestadocomponent.css',
})
export class Cestadocomponent implements OnInit {
  citas: CitaEstado[] = [];
  // Para ADMIN y MÉDICO: el paciente se elige por nombre, no escribiendo un id
  pacientes: Usuarios[] = [];
  pacienteSeleccionado: number | null = null;
  mensaje = '';

  constructor(private cS: Citasservice,
    private uS: Usuariosservice,
    private loginService: Loginservice,
    private cdr: ChangeDetectorRef
  ) { }

  get esPaciente(): boolean {
    return !this.loginService.hasAnyRole(['ADMIN', 'MEDICO']);
  }

  get esMedico(): boolean {
    return !this.loginService.hasAnyRole(['ADMIN']) && this.loginService.hasAnyRole(['MEDICO']);
  }

  // El paciente ve sus citas apenas entra; el personal primero elige al paciente
  ngOnInit(): void {
    if (this.esPaciente) {
      this.mostrarCitas(this.cS.getMisEstados(), 'Todavía no tienes citas registradas.');
    } else {
      this.listarPacientes();
    }
  }

  // El médico ve en la lista a sus pacientes; el ADMIN, a todos
  listarPacientes(): void {
    const pedido = this.esMedico ? this.uS.getMisPacientes() : this.uS.getPacientes();
    pedido.subscribe({
      next: (data) => {
        this.pacientes = data;
        this.mensaje = data.length === 0 ? 'No hay pacientes con citas para mostrar.' : '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al obtener los pacientes: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  seleccionarPaciente(idPaciente: number): void {
    this.pacienteSeleccionado = idPaciente;
    this.mostrarCitas(this.cS.getEstadosDePaciente(idPaciente), 'El paciente no tiene citas registradas.');
  }

  private mostrarCitas(pedido: Observable<CitaEstado[]>, sinCitas: string): void {
    this.mensaje = 'Buscando...';
    this.citas = [];
    pedido.subscribe({
      next: (data) => {
        this.citas = data;
        this.mensaje = data.length === 0 ? sinCitas : '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `Error al obtener las citas: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  fecha(valor: string): Date | null {
    return fechaLocal(valor);
  }

  hora(valor: string): string {
    return valor ? valor.substring(0, 5) : '';
  }
}
