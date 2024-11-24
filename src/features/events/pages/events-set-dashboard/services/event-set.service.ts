import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventSetService {
  private localVarPath =  `/api/EventSet/EventSetFlatList`;

  constructor(
    private http: HttpClient) {
  }
 
  getEventSetFlatList(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}${this.localVarPath}` );
  }
}
