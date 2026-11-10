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
}
