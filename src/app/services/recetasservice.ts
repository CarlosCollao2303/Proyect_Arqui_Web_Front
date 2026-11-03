import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recetas } from '../models/Recetas';

@Injectable({
  providedIn: 'root',
})
export class Recetasservice {
  private apiURL = `${environment.base}/api/recetas`;

  constructor(private http: HttpClient) {}

  getListRecetas(): Observable<Recetas[]> {
    return this.http.get<Recetas[]>(`${this.apiURL}/Listar`);
  }

  deleteReceta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  insertReceta(receta: Recetas): Observable<Recetas> {
    return this.http.post<Recetas>(`${this.apiURL}/Registrar`, receta);
  }
}
