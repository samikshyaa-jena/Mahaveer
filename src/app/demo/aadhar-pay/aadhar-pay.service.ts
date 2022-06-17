import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import jwt_decode from 'jwt-decode';
import { timeout, catchError } from "rxjs/operators";
import 'rxjs/add/observable/throw'

@Injectable({
  providedIn: 'root'
})
export class AadharPayService {
  timeOut: boolean = false;


  constructor(
    private http: HttpClient
  ) { }

   headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

    requestOptions = {
    headers: new Headers(this.headerDict),
  };

  aadharPay(encodeUrl:string,postData: {mobileNumber: string, aadhartotal: string ,BankName: string, amount: string,dpId: string, rdsId: string,dc: string, mi: string, mcData: string,Skey: string, hmac: string,encryptedPID:string,ci:string,apiUser:string,freshnessFactor:string ,operation:string,shakey:string}) {
    return this.http.post(encodeUrl,postData);
  }
}

