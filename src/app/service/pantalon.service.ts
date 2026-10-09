
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Pantalon,
  PantalonFormulario
} from '../models/pantalon.model';

@Injectable({
  providedIn: 'root'
})
export class PantalonService {

  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/Pantalones';

  obtenerTodos(): Observable<Pantalon[]> {
    return this.http.get<Pantalon[]>(this.url);
  }

  obtenerPorId(id: string): Observable<Pantalon> {
    return this.http.get<Pantalon>(`${this.url}/${id}`);
  }

  agregar(
    pantalon: PantalonFormulario
  ): Observable<Pantalon> {
    return this.http.post<Pantalon>(
      this.url,
      pantalon
    );
  }

  editar(
    id: string,
    pantalon: PantalonFormulario
  ): Observable<Pantalon> {
    return this.http.put<Pantalon>(
      `${this.url}/${id}`,
      pantalon
    );
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/${id}`
    );
  }
}
