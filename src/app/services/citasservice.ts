import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Citas } from '../models/Citas';

@Injectable({
  providedIn: 'root',
})
export class Citasservice {
  private apiURL = `${environment.base}/api/citas`;

  constructor(private http: HttpClient) {}

  getListCitas(): Observable<Citas[]> {
    return this.http.get<Citas[]>(`${this.apiURL}/Listar`);
  }
}
