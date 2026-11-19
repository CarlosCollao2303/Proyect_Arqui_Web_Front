import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuarios } from '../models/Usuarios';

@Injectable({
  providedIn: 'root',
})
export class Usuariosservice {
  private apiURL = `${environment.base}/api/usuarios`;

  constructor(private http: HttpClient) {}

  getListUsuarios(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.apiURL}/Listar`);
  }

  getUsuarioById(id: number): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.apiURL}/ListarPorId/${id}`);
  }

  insertUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.post<Usuarios>(`${this.apiURL}/Registrar`, usuario);
  }

  updateUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.put<Usuarios>(`${this.apiURL}/Actualizar`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
