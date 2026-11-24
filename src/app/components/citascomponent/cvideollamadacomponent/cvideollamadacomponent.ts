import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LucideArrowLeft, LucideCalendarClock, LucideCopy, LucideExternalLink, LucidePhoneOff, LucideSmartphone, LucideStethoscope, LucideUserRound, LucideVideo } from '@lucide/angular';
import { Videollamada } from '../../../models/Videollamada';
import { Citasservice } from '../../../services/citasservice';

// external_api.js (la API iframe de Jitsi Meet) se carga en tiempo de ejecución
// y deja la clase JitsiMeetExternalAPI en window; por eso se declara y no se importa.
declare const JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-cvideollamadacomponent',
  imports: [MatButtonModule, RouterLink, LucideArrowLeft, LucideCalendarClock, LucideCopy, LucideExternalLink, LucidePhoneOff, LucideSmartphone, LucideStethoscope, LucideUserRound, LucideVideo],
  templateUrl: './cvideollamadacomponent.html',
  styleUrl: './cvideollamadacomponent.css',
})
export class Cvideollamadacomponent implements OnInit, OnDestroy {
  idCita: number = 0;
  videollamada: Videollamada | null = null;
  mensaje: string = '';
  conectando: boolean = false;
  enLlamada: boolean = false;
  copiado: boolean = false;
  private api: any = null;

  @ViewChild('contenedorJitsi') contenedorJitsi!: ElementRef<HTMLDivElement>;

  constructor(private cS: Citasservice,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Recuperar el id de la cita desde la URL
    this.idCita = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idCita || isNaN(this.idCita)) {
      this.mensaje = 'ID de cita inválido';
      return;
    }

    this.obtenerVideollamada();
  }

  obtenerVideollamada() {
    this.cS.getVideollamada(this.idCita).subscribe({
      next: (data) => {
        this.videollamada = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mensaje = `No se pudo abrir la videollamada: ${error.error?.message ?? error.message}`;
        this.cdr.detectChanges();
      },
    });
  }

  ingresar(nombre: string) {
    // Jitsi solo funciona en el navegador (no durante el renderizado en el servidor).
    if (!this.videollamada || this.conectando || !isPlatformBrowser(this.platformId)) return;

    const datos = this.videollamada;
    this.conectando = true;
    this.mensaje = 'Conectando con Jitsi Meet...';
    this.cdr.detectChanges();

    this.cargarApiJitsi(datos.dominio)
      .then(() => {
        // Primero se muestra el contenedor para que el iframe tome el ancho correcto.
        this.enLlamada = true;
        this.cdr.detectChanges();

        this.api = new JitsiMeetExternalAPI(datos.dominio, {
          roomName: datos.sala,
          parentNode: this.contenedorJitsi.nativeElement,
          width: '100%',
          height: 600,
          lang: 'es',
          userInfo: { displayName: nombre },
          configOverwrite: { prejoinPageEnabled: true },
        });

        // Cuando se cuelga desde los controles de Jitsi se cierra el iframe.
        this.api.addListener('readyToClose', () => this.salir());

        this.conectando = false;
        this.mensaje = '';
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.conectando = false;
        this.mensaje = 'No se pudo cargar Jitsi Meet. Revisa tu conexión a internet.';
        this.cdr.detectChanges();
      });
  }

  // La sala de Jitsi es solo un enlace: abierto en otro dispositivo entra a la misma videollamada
  copiarEnlace() {
    if (!this.videollamada || !isPlatformBrowser(this.platformId)) return;

    navigator.clipboard.writeText(this.videollamada.enlace)
      .then(() => {
        this.copiado = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.copiado = false;
          this.cdr.detectChanges();
        }, 2500);
      })
      .catch(() => {
        this.mensaje = 'No se pudo copiar el enlace. Selecciónalo y cópialo a mano.';
        this.cdr.detectChanges();
      });
  }

  salir() {
    this.api?.dispose();
    this.api = null;
    this.enLlamada = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // Si se cambia de página en plena llamada se libera la cámara y el micrófono.
    this.api?.dispose();
  }

  // Carga https://<dominio>/external_api.js una sola vez por sesión.
  private cargarApiJitsi(dominio: string): Promise<void> {
    if (typeof JitsiMeetExternalAPI !== 'undefined') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://${dominio}/external_api.js`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        reject();
      };
      document.body.appendChild(script);
    });
  }
}
