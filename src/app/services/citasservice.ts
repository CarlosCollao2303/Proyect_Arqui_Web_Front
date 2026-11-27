import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Citas } from '../models/Citas';
import { Videollamada } from '../models/Videollamada';
import { CitaEstado } from '../models/CitaEstado';
import { CitasEspecialidad } from '../models/CitasEspecialidad';
import { EsperaMedico } from '../models/EsperaMedico';
import { CitasMes } from '../models/CitasMes';

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

  getEstadoCita(id: number): Observable<CitaEstado> {
    return this.http.get<CitaEstado>(`${this.apiURL}/${id}/estado`);
  }

  // Citas del paciente logueado con su estado (el back lo saca del token)
  getMisEstados(): Observable<CitaEstado[]> {
    return this.http.get<CitaEstado[]>(`${this.apiURL}/estados/mias`);
  }

  // Citas de un paciente elegido por el personal
  getEstadosDePaciente(idPaciente: number): Observable<CitaEstado[]> {
    return this.http.get<CitaEstado[]>(`${this.apiURL}/estados/paciente/${idPaciente}`);
  }

  // ADMIN: todas las citas; MÉDICO: las que atiende. Con los nombres ya resueltos.
  getEstados(): Observable<CitaEstado[]> {
    return this.http.get<CitaEstado[]>(`${this.apiURL}/estados`);
  }

  getCitasPorEspecialidad(): Observable<CitasEspecialidad[]> {
    return this.http.get<CitasEspecialidad[]>(`${this.apiURL}/estado-por-especialidad`);
  }

  getEsperaPorMedico(): Observable<EsperaMedico[]> {
    return this.http.get<EsperaMedico[]>(`${this.apiURL}/espera-por-medico`);
  }

  // Siempre trae los 12 meses del año, los que no tienen citas en cero
  getEvolucionMensual(anio: number): Observable<CitasMes[]> {
    return this.http.get<CitasMes[]>(`${this.apiURL}/evolucion-mensual`, { params: { anio } });
  }

  // Años con al menos una cita, del más reciente al más antiguo
  getAniosConCitas(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiURL}/anios-con-citas`);
  }
}
