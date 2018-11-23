import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subscriber, observable } from 'rxjs';
import { error } from 'protractor';

@Injectable({
    providedIn: 'root',
})
export class ToDoService {
    base_url: string = null;
    constructor(private http: HttpClient) { }

    getAll() {
        this.base_url = null;
        return new Observable((observable) => {
            this.base_url = this.getRoute() + 'find-all'
            this.http.request('GET', this.base_url).subscribe(result => {
                console.log(result);
                observable.next(result);
                observable.complete();
            })
        })
    }

    saveNew(data) {
        this.base_url = null;
        return new Observable((observable) => {
            this.base_url = this.getRoute() + 'add';
            this.http.post(this.base_url, data, { responseType: 'text' }).subscribe((result) => {
                observable.next(JSON.parse(JSON.stringify(result)));
            }, error => {
                console.log(JSON.parse(JSON.stringify(error)));
                observable.complete();
            })
        })
    }

    update(data) {
        this.base_url = null;
        return new Observable((observable)=>{
            this.base_url = this.getRoute() + 'update/' + data.id;
            this.http.put(this.base_url, data, { responseType: 'text' }).subscribe(result=>{
                observable.next(JSON.parse(JSON.stringify(result)));
            },error=>{
                console.log(JSON.parse(JSON.stringify(error)));
                observable.complete();
            })
        })
    }

    delete(id) {
        this.base_url = null;
        return new Observable((observable)=>{
            this.base_url = this.getRoute() + 'delete/' + id;
            this.http.post(this.base_url, {}, { responseType: 'text' }).subscribe(result=>{
                observable.next(JSON.parse(JSON.stringify(result)));
            },error=>{
                console.log(JSON.parse(JSON.stringify(error)));
                observable.complete();
            })
        })
    }

    getRoute(): string {
        return 'http://127.0.0.1:5000/';
    }

}