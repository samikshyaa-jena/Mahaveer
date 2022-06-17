import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { CashoutService } from "../cashout.service";
import { AuthConfig } from 'src/app/app-config';
import { CashoutApi } from '../cashout.api';
import { StorageMap } from "@ngx-pwa/local-storage";

@Component({
  selector: 'app-cashout-wallet2',
  templateUrl: './wallet2.component.html',
  styleUrls: ['./wallet2.component.scss']
})
export class Wallet2Component implements OnInit {
  wallet2Form: FormGroup;
  cashoutForm: FormGroup;
  storeData: any;
  cashoutData: any;

  constructor(
    private datePipe: DatePipe,
    private cashoutService: CashoutService,
    private storage: StorageMap
  ) { }

  ngOnInit() {

    // this.storage.get('dashData').subscribe((storageDashData) => {
    //   console.log('Storage Dash Data: ', storageDashData);
    // });
    this.storage.get('wallet1').subscribe((wallet1) => {
      this.storeData = { ...this.storeData, w1Data: wallet1 };
    });
    this.storage.get('wallet2').subscribe((wallet2) => {
      this.storeData = { ...this.storeData, w2Data: wallet2 };
    });

    this.fetchCashoutData();

    // this.storeData = { w1Data: sessionStorage.getItem('w1Data'), w2Data: sessionStorage.getItem('w2Data') };

    this.wallet2Form = new FormGroup({
      transactionType: new FormControl('', Validators.required)
    });

    this.cashoutForm = new FormGroup({
      bankName: new FormControl({ value: '', disabled: true }, Validators.required),
      ifsc: new FormControl({ value: '', disabled: true }, Validators.required),
      accountNumber: new FormControl({ value: '', disabled: true }, Validators.required)
    });

  }

  async fetchCashoutData() {

    const encurl = await AuthConfig.config.encodeUrl(CashoutApi.url.cashout);

    this.cashoutService.cashoutData(encurl).subscribe(
      (res: any) => {
        this.cashoutData = res;
        this.cashoutForm.patchValue(res);
      },
      (err: any) => {
        console.log('Cashout Error Data: ', err);
      }
    );
  }

  private getSelectedData(data: any) {
    const {accountNumber, bankName, ifsc} = data;
    return {accountNumber, bankName, ifsc};
  }

  submitCashout() {
    const validFormData = this.getSelectedData(this.cashoutForm.value);
    const validCashoutData = this.getSelectedData(this.cashoutData);

    if (JSON.stringify(validFormData) === JSON.stringify(validCashoutData)) {
      // Submit form here.
    } else {
      // Don't submit form.
    }
  }


}
