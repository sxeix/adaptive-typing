import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlaskService {

  url = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  basicRequest(): Observable<any> {
    return this.http.get(this.url+'/basic');
  }

}
