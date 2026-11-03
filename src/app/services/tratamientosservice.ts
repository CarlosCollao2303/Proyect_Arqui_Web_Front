import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tratamientos } from '../models/Tratamientos';

@Injectable({
  providedIn: 'root',
})
export class Tratamientosservice {
  private apiURL=`${environment.base}/api/tratamientos`

  constructor(private http:HttpClient) {}

  getListTratamientos() :Observable<Tratamientos[]>{
    return this.http.get<Tratamientos[]>(`${this.apiURL}/Listar`);
  }

  deleteTratamiento(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  insertTratamiento(sT:Tratamientos):Observable<Tratamientos>{
    return this.http.post<Tratamientos>(`${this.apiURL}/Registrar`,sT);
  }
}
