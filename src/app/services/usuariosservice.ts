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

  // Todos los pacientes (para formularios y para "Todos los pacientes" del médico)
  getPacientes(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.apiURL}/pacientes`);
  }

  // Pacientes con citas con el médico logueado (el back lo saca del token)
  getMisPacientes(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.apiURL}/mis-pacientes`);
  }

  getMedicos(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.apiURL}/medicos`);
  }

  // Datos del usuario logueado
  getPerfil(): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.apiURL}/perfil`);
  }

  // Busca por nombre o DNI; para un médico el back solo busca entre pacientes
  buscarUsuarios(texto: string): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.apiURL}/Buscar`, { params: { texto } });
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

  asignarRol(idUsuario: number, idRol: number): Observable<Usuarios> {
    return this.http.put<Usuarios>(`${this.apiURL}/AsignarRol/${idUsuario}/${idRol}`, null);
  }

  asignarEspecialidad(idUsuario: number, idEspecialidad: number): Observable<Usuarios> {
    return this.http.put<Usuarios>(`${this.apiURL}/AsignarEspecialidad/${idUsuario}/${idEspecialidad}`, null);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
