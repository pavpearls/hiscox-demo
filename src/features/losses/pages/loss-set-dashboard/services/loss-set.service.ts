import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LossSetService {
  private localVarPath =  `/api/LossSet/FlatList`;

  constructor(
    private http: HttpClient) {
  }

  getLossSetFlatList(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}${this.localVarPath}` );
  }
}