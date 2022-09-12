import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErpServiceService {

  constructor(
    private http: HttpClient
  ) {}

  


  post_Reqs(url: string, reqBody: any) {
    return this.http.post(url, reqBody);
  }
  get_Reqs(url: string) {
    return this.http.get(url);
  }
  get_Reqs_params(url: string, header: any) {
    return this.http.get(url, header);
  }
}
