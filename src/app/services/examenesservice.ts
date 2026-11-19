import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Examenes } from '../models/Examenes';
import { ExamenPendiente } from '../models/ExamenPendiente';

@Injectable({
  providedIn: 'root',
})
export class Examenesservice {
  private apiURL = `${environment.base}/api/examenes`;

  constructor(private http: HttpClient) {}

  getListExamenes(): Observable<Examenes[]> {
    return this.http.get<Examenes[]>(`${this.apiURL}/Listar`);
  }

  getExamenById(id: number): Observable<Examenes> {
    return this.http.get<Examenes>(`${this.apiURL}/${id}`);
  }

  updateExamen(examen: Examenes): Observable<Examenes> {
    return this.http.put<Examenes>(`${this.apiURL}/Actualizar`, examen);
  }

  deleteExamen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  insertExamen(examen: Examenes): Observable<Examenes> {
    return this.http.post<Examenes>(`${this.apiURL}/Registrar`, examen);
  }

  getExamenesPendientes(): Observable<ExamenPendiente[]> {
    return this.http.get<ExamenPendiente[]>(`${this.apiURL}/pendientes`);
  }
}
