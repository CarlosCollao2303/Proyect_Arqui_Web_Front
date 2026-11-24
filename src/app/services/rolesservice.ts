import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Roles } from '../models/Roles';

@Injectable({
  providedIn: 'root',
})
export class Rolesservice {
  private apiURL = `${environment.base}/roles`;

  constructor(private http: HttpClient) {}

  getListRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(`${this.apiURL}/Listar`);
  }

  // Roles cuyo nombre contiene el texto (sin importar mayúsculas)
  buscarRoles(nombre: string): Observable<Roles[]> {
    return this.http.get<Roles[]>(`${this.apiURL}/Buscar`, { params: { nombre } });
  }

  getRolById(id: number): Observable<Roles> {
    return this.http.get<Roles>(`${this.apiURL}/ListarPorId/${id}`);
  }

  insertRol(rol: Roles): Observable<Roles> {
    return this.http.post<Roles>(`${this.apiURL}/Registrar`, rol);
  }

  updateRol(rol: Roles): Observable<Roles> {
    return this.http.put<Roles>(`${this.apiURL}/Actualizar`, rol);
  }

  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
