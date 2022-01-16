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
        return this.http.get(this.url + '/basic');
    }

    randomWordsetRequest(): Observable<any> {
        return this.http.get(this.url + "/rand-words");
    }

    getUsers(): Observable<any> {
        console.log('request to be made');
        return this.http.get(this.url + "/get-users");
    }

    tailoredWordsetRequest(user: string): Observable<any> {
        const content = { "user":user };
        return this.http.post(this.url + "/tailored-wordset", content);
    }

    postTestResult(typed: string[], actual: string[], user: string): Observable<any> {
        const content = { "typed": typed, "actual": actual, "user":user};
        return this.http.post(this.url + "/test-result", content);
    }

    changeUser(user: string): Observable<any> {
        const content = { "user": user };
        return this.http.post(this.url + "/change-user", content);
    }

}
