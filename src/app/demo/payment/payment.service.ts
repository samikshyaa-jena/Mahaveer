import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    constructor(
        private http: HttpClient
    ) {}

    postReqs(url: string, postData: any) {
        return this.http.post(url, postData);
    }
    bankChlanVaAPI(encURL:any, postData: any) {
        return this.http.post(encURL, postData);
    }
    createVaAPI(encURL:any, postData: any) {
        return this.http.post(encURL, postData);
    }
    fetchBankListAPI(encURL:any, postData: any) {
        return this.http.post(encURL, postData);
    }
    payUsingUpiId(encURL:any, postData: any) {
        return this.http.post(encURL, postData);
    }
    verifyvpaAPI(encURL:any, postData: any) {
        return this.http.post(encURL, postData);
    }
    insertvpa_API(encURL:any, postData: any) {
        return this.http.post(encURL, postData);
    }
}