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
}
