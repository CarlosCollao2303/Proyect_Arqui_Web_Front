import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistoriasClinicas } from '../models/HistoriasClinicas';

@Injectable({
  providedIn: 'root',
})
export class Historiasclinicasservice {
  private apiURL = `${environment.base}/api/historiasclinicas`;

  constructor(private http: HttpClient) {}

  getListHistorias(): Observable<HistoriasClinicas[]> {
    return this.http.get<HistoriasClinicas[]>(`${this.apiURL}/Listar`);
  }
}
