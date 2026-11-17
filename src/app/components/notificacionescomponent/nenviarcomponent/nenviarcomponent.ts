import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideSend } from '@lucide/angular';
import { Notificaciones } from '../../../models/Notificaciones';
import { Usuarios } from '../../../models/Usuarios';
import { Notificacionesservice } from '../../../services/notificacionesservice';
import { Usuariosservice } from '../../../services/usuariosservice';

@Component({
  selector: 'app-nenviarcomponent',
  imports: [MatInputModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, LucideSend],
  templateUrl: './nenviarcomponent.html',
  styleUrl: './nenviarcomponent.css',
})
export class Nenviarcomponent implements OnInit {
  formNotificacion: any;
  mensaje: string = '';
  enviando: boolean = false;
  listaUsuarios: Usuarios[] = [];

  tipos = [
    { value: 'RECORDATORIO', viewValue: 'Recordatorio de cita' },
    { value: 'RESULTADO_EXAMEN', viewValue: 'Resultado de examen' },
    { value: 'AVISO_GENERAL', viewValue: 'Aviso general' },
  ];

  constructor(private nS: Notificacionesservice,
    private uS: Usuariosservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.formNotificacion = this.fb.group({
      usuario: ['', Validators.required],
      tipo: ['RECORDATORIO', Validators.required],
      mensaje: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios() {
    this.uS.getListUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error al obtener los usuarios:', err);
      },
    });
  }

  enviarNotificacion() {
    if (this.formNotificacion.invalid) {
      this.mensaje = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const notificacion: Notificaciones = {
      idNotificacion: 0,
      idUsuario: this.formNotificacion.value.usuario,
      tipo: this.formNotificacion.value.tipo,
      mensaje: this.formNotificacion.value.mensaje,
      fechaEnvio: new Date(),
      estadoEnvio: '',
    };

    const correo = this.listaUsuarios.find(u => u.idUsuario === notificacion.idUsuario)?.correo ?? '';
    this.enviando = true;
    this.mensaje = 'Enviando correo...';
    this.cdr.detectChanges();

    this.nS.enviarCorreo(notificacion).subscribe({
      next: () => {
        this.enviando = false;
        this.mensaje = `Correo enviado correctamente a ${correo}.`;
        this.formNotificacion.reset({ usuario: '', tipo: 'RECORDATORIO', mensaje: '' });
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
