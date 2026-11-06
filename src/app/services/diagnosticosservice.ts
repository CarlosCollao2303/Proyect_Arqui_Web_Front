import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Diagnosticos } from '../models/Diagnosticos';

@Injectable({
  providedIn: 'root',
})
export class Diagnosticosservice {
  private apiURL = `${environment.base}/api/diagnosticos`;

  constructor(private http: HttpClient) {}

  getListDiagnosticos(): Observable<Diagnosticos[]> {
    return this.http.get<Diagnosticos[]>(`${this.apiURL}/Listar`);
  }

  getDiagnosticoById(id: number): Observable<Diagnosticos> {
    return this.http.get<Diagnosticos>(`${this.apiURL}/${id}`);
  }

  updateDiagnostico(diagnostico: Diagnosticos): Observable<Diagnosticos> {
    return this.http.put<Diagnosticos>(`${this.apiURL}/Actualizar`, diagnostico);
  }

  deleteDiagnostico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  insertDiagnostico(diagnostico: Diagnosticos): Observable<Diagnosticos> {
    return this.http.post<Diagnosticos>(`${this.apiURL}/Registrar`, diagnostico);
  }
}
