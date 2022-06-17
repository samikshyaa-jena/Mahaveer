import { Component, OnInit } from '@angular/core';
import { AuthConfig } from 'src/app/app-config';
import { PaymentApi } from '../payment.api';
import { PaymentService } from '../payment.service';
import { finalize } from "rxjs/operators";
import { Router } from '@angular/router';

import * as vex from 'vex-js';

@Component({
  selector: 'app-bankchallan',
  templateUrl: './bankchallan.component.html',
  styleUrls: ['./bankchallan.component.scss']
})
export class BankchallanComponent implements OnInit {
  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  virtualAccount:any;
  ifNoVA = false;
  challanDay:any;
  challanMon:any;
  challanYear:any;

  bnkChlnLoader = false;
  paymentInfo:any = {
    karurbank: false,
    icicibank: false,
    axisbank: false
  }
  origPaymentInfo = Object.assign({}, this.paymentInfo);
  downloadChalan = async (bnkname:any) => {
    this.bnkChlnLoader = true;
    this.paymentInfo = Object.assign({}, this.origPaymentInfo);
    this.ifNoVA = false;

    const {userInfo: {userName}} = JSON.parse(sessionStorage.getItem('dashboardData'));
    switch(bnkname){
      case 'kvb':
          let encURL = await AuthConfig.config.encodeUrl(PaymentApi.url.vrtlaccnt);
          this.paymentService.bankChlanVaAPI(encURL, {"username": userName})
          .pipe(finalize(() => { this.bnkChlnLoader = false; }))
          .subscribe(
            (res: any) => {
              if(res.status == 0) {
                let vaDtlsKvb = {
                  virtualAccount: res.data[0].kvb,
                  challanDay: new Date().getDate() <= 9 ? '0' + new Date().getDate() : new Date().getDate(),
                  challanMon: (new Date().getMonth()+1) <= 9 ? '0' + (new Date().getMonth() +1) : new Date().getMonth() +1,
                  challanYear: new Date().getFullYear(),
                  bankname: bnkname,
                  username: userName
                }
                return this.router.navigate(['/depositslip'], { state: vaDtlsKvb });
              } else {
                this.ifNoVA = true;
                vex.dialog.alert(`You don't have Virtual Account. Click on "Add Virtual Account" button to generate`);
                // alert(`You don't have Virtual Account. Click on "Add Virtual Account" button to generate`);
              }
            },
            (err: any) => {
              this.ifNoVA = true;
              vex.dialog.alert(`You don't have Virtual Account. Click on "Add Virtual Account" button to generate`)
            }
          );        
          this.paymentInfo.karurbank = true;
        break;
        
        case 'axis':
          let vaDtlsAxis = {
            username: userName,
            bankname: bnkname
          }
          this.bnkChlnLoader = false;
          return this.router.navigate(['/depositslip'], { state: vaDtlsAxis });
          
          case 'icici':
          let vaDtlsIcici = {
            username: userName,
            bankname: bnkname
          }
          this.bnkChlnLoader = false;
          return this.router.navigate(['/depositslip'], { state: vaDtlsIcici });
    }
  }
  addVrtlAccnt = async (bnkname:any) => {
    this.bnkChlnLoader = true;

    const {userInfo: {userName}} = JSON.parse(sessionStorage.getItem('dashboardData'));
    let encURL = await AuthConfig.config.encodeUrl(PaymentApi.url.createVrtlaccnt);

    this.paymentService.createVaAPI(encURL, {"username": userName})
    .pipe(finalize(() => { this.bnkChlnLoader = false; }))
    .subscribe(
      (res: any) => {
        if(res.status == 0) {
          let vaDtls = {
            virtualAccount: res.virtual_account,
            challanDay: new Date().getDate() <= 9 ? '0' + new Date().getDate() : new Date().getDate(),
            challanMon: (new Date().getMonth()+1) <= 9 ? '0' + (new Date().getMonth() +1) : new Date().getMonth() +1,
            challanYear: new Date().getFullYear(),
            username: userName,
            bankname: bnkname
          }
          return this.router.navigate(['/depositslip'], { state: vaDtls });
        }else {
          // alert(`Some Error occured`);
          vex.dialog.alert(`Some Error occured`)
        }
      },
      (err: any) => {
        // alert(`Some Error occured`);
          vex.dialog.alert(`Some Error occured`)
      }
    );
  }
}