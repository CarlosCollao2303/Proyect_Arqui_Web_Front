import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DetalleHistorial } from '../models/DetalleHistorial';

@Injectable({
  providedIn: 'root',
})
export class Detallehistorialservice {
  private apiURL = `${environment.base}/api/detallehistorial`;

  constructor(private http: HttpClient) {}

  getListDetalles(): Observable<DetalleHistorial[]> {
    return this.http.get<DetalleHistorial[]>(`${this.apiURL}/Listar`);
  }

  getDetalleById(id: number): Observable<DetalleHistorial> {
    return this.http.get<DetalleHistorial>(`${this.apiURL}/ListarPorId/${id}`);
  }

  insertDetalle(detalle: DetalleHistorial): Observable<DetalleHistorial> {
    return this.http.post<DetalleHistorial>(`${this.apiURL}/Registrar`, detalle);
  }

  updateDetalle(detalle: DetalleHistorial): Observable<DetalleHistorial> {
    return this.http.put<DetalleHistorial>(`${this.apiURL}/Actualizar`, detalle);
  }

  deleteDetalle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
