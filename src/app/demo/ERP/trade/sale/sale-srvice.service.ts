import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleSrviceService {

  x: any;
  d:any;
  y: any;
  i: any;

  constructor() { }

  data = new EventEmitter<any>();
  sendData = (data,data1,data2) =>{
    // this.data.emit(data);
    this.x = data;
    this.y = data1;
    this.i = data2;
  }
  cust(){
    return this.x;
  }
  sale(){
    return this.y;
  }
  invo(){
    return this.i;
  }
}

