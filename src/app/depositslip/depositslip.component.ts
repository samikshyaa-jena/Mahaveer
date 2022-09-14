import { Component, OnInit } from '@angular/core';
// import { PaymentService } from '../demo/payment/payment.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-depositslip',
  templateUrl: './depositslip.component.html',
  styleUrls: ['./depositslip.component.scss']
})
export class DepositslipComponent implements OnInit {
  subscription: Subscription;
  virtualAccount:any;
  challanDay:any;
  challanMon:any;
  challanYear:any;
  challanData:any;
  bankname:any;
  UserName:any;

  constructor(
    // private paymentService: PaymentService,
    private router: Router
    ) {
      this.challanData = this.router.getCurrentNavigation().extras.state;
      this.virtualAccount = this.challanData.virtualAccount;
      this.challanDay = this.challanData.challanDay;
      this.challanMon = this.challanData.challanMon;
      this.challanYear = this.challanData.challanYear;
      this.bankname = this.challanData.bankname;
      this.UserName = this.challanData.username;
    }
    printWidnow() {
      window.print();
    }
  ngOnInit() {
  }

}
