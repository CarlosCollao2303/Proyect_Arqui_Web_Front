import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificaciones } from '../models/Notificaciones';
import { MensajeCita } from '../models/MensajeCita';

@Injectable({
  providedIn: 'root',
})
export class Notificacionesservice {
  private apiURL = `${environment.base}/api/notificaciones`;

  constructor(private http: HttpClient) {}

  getListNotificaciones(): Observable<Notificaciones[]> {
    return this.http.get<Notificaciones[]>(this.apiURL);
  }

  // El backend envía el correo con Resend y guarda la notificación con su estado.
  enviarCorreo(notificacion: Notificaciones): Observable<Notificaciones> {
    return this.http.post<Notificaciones>(`${this.apiURL}/EnviarCorreo`, notificacion);
  }

  // Mensaje que se enviaría para la cita (no envía nada)
  getVistaPrevia(idCita: number): Observable<MensajeCita> {
    return this.http.get<MensajeCita>(`${this.apiURL}/VistaPrevia/${idCita}`);
  }

  // Envía el mensaje pre armado de la cita: solo hace falta el id
  enviarPorCita(idCita: number): Observable<Notificaciones> {
    return this.http.post<Notificaciones>(`${this.apiURL}/EnviarPorCita`, { idCita });
  }

  deleteNotificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
