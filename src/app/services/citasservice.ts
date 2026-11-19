import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Citas } from '../models/Citas';
import { Videollamada } from '../models/Videollamada';

@Injectable({
  providedIn: 'root',
})
export class Citasservice {
  private apiURL = `${environment.base}/api/citas`;

  constructor(private http: HttpClient) {}

  getListCitas(): Observable<Citas[]> {
    return this.http.get<Citas[]>(`${this.apiURL}/Listar`);
  }

  getCitaById(id: number): Observable<Citas> {
    return this.http.get<Citas>(`${this.apiURL}/${id}`);
  }

  insertCita(cita: Citas): Observable<Citas> {
    return this.http.post<Citas>(`${this.apiURL}/Registrar`, cita);
  }

  updateCita(cita: Citas): Observable<Citas> {
    return this.http.put<Citas>(`${this.apiURL}/Actualizar`, cita);
  }

  deleteCita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  getVideollamada(idCita: number): Observable<Videollamada> {
    return this.http.get<Videollamada>(`${this.apiURL}/${idCita}/videollamada`);
  }
}
