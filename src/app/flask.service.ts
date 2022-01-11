import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
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

  randomWordsetRequest(): Observable<any> {
    return this.http.get(this.url +"/rand-words");
  }

  postTestResult(typed: string[], actual: string[]): Observable<any> {
    const content = {"typed": typed, "actual": actual};
    return this.http.post(this.url+"/test-result", content);
  }

}
