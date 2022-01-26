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
        return this.http.get(this.url + "/get-users");
    }

    tailoredWordsetRequest(user: string, length: number): Observable<any> {
        const content = { "user":user, "length":length };
        return this.http.post(this.url + "/tailored-wordset", content);
    }

    postTestResult(typed: string[], actual: string[], user: string, testStats: Object): Observable<any> {
        const content = { "typed": typed, "actual": actual, "user":user, "stats":testStats};
        return this.http.post(this.url + "/test-result", content);
    }

    changeUser(user: string): Observable<any> {
        const content = { "user": user };
        return this.http.post(this.url + "/change-user", content);
    }
    
    getUserStats(user: string): Observable<any> {
        const content = { "user":user };
        return this.http.post(this.url + "/get-user-stats", content);
    }

}
