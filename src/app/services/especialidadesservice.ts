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

  // Busca por nombre sin importar mayúsculas ni tildes ("cardiologia" encuentra "Cardiología")
  buscarEspecialidades(nombre: string): Observable<Especialidades[]> {
    return this.http.get<Especialidades[]>(`${this.apiURL}/Buscar`, { params: { nombre } });
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

  // Todos los médicos activos con su especialidad
  getTodosLosMedicos(): Observable<MedicoPorEspecialidad[]> {
    return this.http.get<MedicoPorEspecialidad[]>(`${this.apiURL}/medicos`);
  }

  // Solo las especialidades que tienen médicos disponibles (para el desplegable)
  getEspecialidadesConMedicos(): Observable<Especialidades[]> {
    return this.http.get<Especialidades[]>(`${this.apiURL}/con-medicos`);
  }

  getMedicosPorEspecialidad(id: number): Observable<MedicoPorEspecialidad[]> {
    return this.http.get<MedicoPorEspecialidad[]>(`${this.apiURL}/${id}/medicos`);
  }
}
