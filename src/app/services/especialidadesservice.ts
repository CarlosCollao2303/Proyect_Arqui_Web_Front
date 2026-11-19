import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Especialidades } from '../models/Especialidades';
import { MedicoPorEspecialidad } from '../models/MedicoPorEspecialidad';

@Injectable({
  providedIn: 'root',
})
export class Especialidadesservice {
  private apiURL = `${environment.base}/api/especialidades`;

  constructor(private http: HttpClient) {}

  getListEspecialidades(): Observable<Especialidades[]> {
    return this.http.get<Especialidades[]>(`${this.apiURL}/Listar`);
  }

  getEspecialidadById(id: number): Observable<Especialidades> {
    return this.http.get<Especialidades>(`${this.apiURL}/ListarPorId/${id}`);
  }

  insertEspecialidad(especialidad: Especialidades): Observable<Especialidades> {
    return this.http.post<Especialidades>(`${this.apiURL}/Registrar`, especialidad);
  }

  updateEspecialidad(especialidad: Especialidades): Observable<Especialidades> {
    return this.http.put<Especialidades>(`${this.apiURL}/Actualizar`, especialidad);
  }

  deleteEspecialidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  getMedicosPorEspecialidad(id: number): Observable<MedicoPorEspecialidad[]> {
    return this.http.get<MedicoPorEspecialidad[]>(`${this.apiURL}/${id}/medicos`);
  }
}
