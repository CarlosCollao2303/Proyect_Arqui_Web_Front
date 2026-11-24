import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LucideSend } from '@lucide/angular';
import { CitaEstado } from '../../../models/CitaEstado';
import { MensajeCita } from '../../../models/MensajeCita';
import { Citasservice } from '../../../services/citasservice';
import { Notificacionesservice } from '../../../services/notificacionesservice';
import { fechaLocal } from '../../../utils/fechas';

// Nombre legible de cada tipo de notificación de cita
const TIPOS: Record<string, string> = {
  RECORDATORIO: 'Recordatorio de cita',
  CITA_REGISTRADA: 'Cita registrada',
  CITA_REPROGRAMADA: 'Cita reprogramada',
  CITA_ATENDIDA: 'Cita atendida',
  CITA_CANCELADA: 'Cita cancelada',
};

@Component({
  selector: 'app-nenviarcomponent',
  providers: [DatePipe],
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatSelectModule, LucideSend],
  templateUrl: './nenviarcomponent.html',
  styleUrl: './nenviarcomponent.css',
})
export class Nenviarcomponent implements OnInit {
  // ADMIN ve todas las citas; MÉDICO, las que atiende (lo filtra el back)
  citas: CitaEstado[] = [];
  idCitaSeleccionada: number | null = null;
  // Mensaje armado por el back con los datos de la cita: nadie lo escribe
  vistaPrevia: MensajeCita | null = null;
  mensaje: string = '';
  enviando: boolean = false;

  constructor(private nS: Notificacionesservice,
    private cS: Citasservice,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cS.getEstados().subscribe({
      next: (data) => {
        this.citas = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener las citas:', err);
      },
    });
  }

  // Texto de cada opción del desplegable armado con los datos de la cita
  etiquetaCita(cita: CitaEstado): string {
    const fecha = this.datePipe.transform(fechaLocal(cita.fecha), 'dd/MM/yyyy');
    return `#${cita.idCita} · ${cita.paciente} · ${fecha} · ${cita.estado}`;
  }

  tipoLegible(tipo: string): string {
    return TIPOS[tipo] ?? tipo;
  }

  seleccionarCita(idCita: number): void {
    this.idCitaSeleccionada = idCita;
    this.vistaPrevia = null;
    this.mensaje = '';
    this.nS.getVistaPrevia(idCita).subscribe({
      next: (data) => {
        this.vistaPrevia = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `No se pudo armar el mensaje: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  enviarNotificacion(): void {
    if (!this.idCitaSeleccionada || !this.vistaPrevia) {
      this.mensaje = 'Elija una cita para notificar.';
      return;
    }

    const correo = this.vistaPrevia.correo;
    this.enviando = true;
    this.mensaje = 'Enviando correo...';
    this.cdr.detectChanges();

    this.nS.enviarPorCita(this.idCitaSeleccionada).subscribe({
      next: () => {
        this.enviando = false;
        this.mensaje = `Correo enviado correctamente a ${correo}.`;
        this.cdr.detectChanges();
      },
      error: (error) => {
        // Si Resend rechaza el correo la notificación igual queda guardada como FALLIDO.
        this.enviando = false;
        this.mensaje = `No se pudo enviar el correo: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }
}
