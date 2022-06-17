import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErpServiceService {

  constructor(
    private http: HttpClient
  ) {}

  


  post_Reqs(url: string, reqBody: any, headers: any) {
    return this.http.post(url, reqBody, headers);
  }
  get_Reqs(url: string, headers: any ) {
    return this.http.get(url, headers);
  }
}
