import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import jwt_decode from 'jwt-decode';
import { timeout, catchError } from "rxjs/operators";
import 'rxjs/add/observable/throw'

@Injectable({
  providedIn: 'root'
})
export class AepsService {
  timeOut: boolean = false;


  constructor(
    private http: HttpClient
  ) { }


 /*  cashwithdraw(encodeUrl,postData: {mobileNumber: string, aadhartotal: string ,BankName: string, amount: string,dpId: string, rdsId: string,dc: string, mi: string, mcData: string,Skey: string, hmac: string,encryptedPID:string,ci:string,apiUser:string,freshnessFactor:string ,operation:string,shakey:string}) {
    return this.http.post(`https://vpn.iserveu.tech/AEPSFRM/aeps2/ibl/cashWithDrawl`,encodeUrl, postData);
  } */

   headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

    requestOptions = {
    headers: new Headers(this.headerDict),
  };

  cashwithdraw(encodeUrl:string,postData: {mobileNumber: string, aadhartotal: string ,BankName: string, amount: string,dpId: string, rdsId: string,dc: string, mi: string, mcData: string,Skey: string, hmac: string,encryptedPID:string,ci:string,apiUser:string,freshnessFactor:string ,operation:string,shakey:string,pidData:any}) {
    return this.http.post(encodeUrl,postData);
  }

  balanceEnquiry(encodeUrl:string,postData: {mobileNumber: string, aadhartotal: string ,BankName: string,dpId: string, rdsId: string,dc: string, mi: string, mcData: string,Skey: string, hmac: string,encryptedPID:string,ci:string,apiUser:string,freshnessFactor:string ,operation:string,shakey:string}) {
    return this.http.post(encodeUrl,postData);
  }

  ministatement(encodeUrl:string,postData: {mobileNumber: string, aadhartotal: string ,BankName: string,dpId: string, rdsId: string,dc: string, mi: string, mcData: string,Skey: string, hmac: string,encryptedPID:string,ci:string,apiUser:string,freshnessFactor:string ,operation:string,shakey:string}) {
    return this.http.post(encodeUrl,postData);
  }

  aadharPay(encodeUrl:string,postData: {mobileNumber: string, aadhartotal: string ,BankName: string, amount: string,dpId: string, rdsId: string,dc: string, mi: string, mcData: string,Skey: string, hmac: string,encryptedPID:string,ci:string,apiUser:string,freshnessFactor:string ,operation:string,shakey:string}) {
    return this.http.post(encodeUrl,postData);
  }


  aeps3ipfetch = () => {
    return this.http.get(`https://api.ipify.org?format=json`);
  }

//   errorHandler(error: HttpErrorResponse) {
//     // console.log(error)
//     this.timeOut = true;
//     return Observable.throw(error.message || "server error.");
// }
}
