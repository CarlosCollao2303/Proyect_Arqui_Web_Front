import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificaciones } from '../models/Notificaciones';

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

  deleteNotificacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
