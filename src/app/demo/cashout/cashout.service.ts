import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CashoutService {
    constructor(
        private http: HttpClient
    ) {}

    wallet1API(w1api, wallet1Data: any) {
        return this.http.post(w1api, wallet1Data);
    }

    cashoutData(url: string) {
        return this.http.get(url);
    }
    
}