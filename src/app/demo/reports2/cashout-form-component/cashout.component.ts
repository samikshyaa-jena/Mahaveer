import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Output, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-cashout-trans-report',
  templateUrl: './cashout.component.html',
  styleUrls: ['./cashout.component.scss']
})
export class CashoutTransComponent implements OnInit, OnDestroy {
  reportForm: FormGroup;
  today = new Date();
  minimumDate = new Date();
  @Output() cashoutData = new EventEmitter();
  unsubscribeSubs = new Subject();

  constructor(
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    // const username = localStorage.getItem(JSON.parse(userInfo.userName));
    // Setting Minimum Date of the Calendar to be 2 months back from Today.
    this.minimumDate.setMonth(this.today.getMonth() - 2);

    this.reportForm = new FormGroup({
      subCat: new FormControl('aeps', null),
      operationPerformed: new FormControl('', null),
      dateRange: new FormControl([this.today, this.today], Validators.required)
    });

    this.subscribeSubCat();
    this.subscribeDateRange();
  }

  subscribeSubCat() {
    this.reportForm.get('subCat').valueChanges
    .pipe(takeUntil(this.unsubscribeSubs))
    .subscribe(
      val => {
        if (val === 'wallet2') {
          this.reportForm.get('operationPerformed').setValidators(Validators.required);
          this.reportForm.updateValueAndValidity();
        } else {
          this.reportForm.get('operationPerformed').setValidators(null);
          this.reportForm.get('operationPerformed').updateValueAndValidity();
        }
      }
    );
  }

  subscribeDateRange() {
    this.reportForm.get('dateRange').valueChanges
    .pipe(takeUntil(this.unsubscribeSubs))
    .subscribe(
      val => {
        const [start, end] = val;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffDays = Math.ceil((<any>endDate - <any>startDate) / (1000 * 60 * 60 * 24));
        (diffDays >= 10) ? this.reportForm.get('dateRange').setErrors({ incorrect: true }) : this.reportForm.get('dateRange').setErrors(null);
      }
    );
  }

  submitReport() {
    // Cashout form submit function added by Akshaya
    let reportData = {};
    if(this.reportForm.get('subCat').value === 'aeps') {
      const { dateRange } = this.reportForm.value;
      reportData = {
        fromDate: this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
        transactionType: 'WALLETCASHOUT',
        subcatVal: this.reportForm.get('subCat').value
      };
    } else if(this.reportForm.get('subCat').value === 'matm') {
      const { dateRange, operationPerformed, status } = this.reportForm.value;
      reportData = {
        fromDate: this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
        transactionType: 'MATM_CASHOUT',
        subcatVal: this.reportForm.get('subCat').value
      };
    } else {
      const { dateRange, operationPerformed, status } = this.reportForm.value;
      const {userInfo: {userName}} = JSON.parse(sessionStorage.getItem('dashboardData'));
      reportData = {
        end_date: this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
        start_date: this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
        operationPerformed: [operationPerformed],
        isApi: true,
        userName,
        subcatVal: this.reportForm.get('subCat').value
      };
    }
    this.cashoutData.emit({type: 'cashout', data: reportData});
  }

  ngOnDestroy() {
    this.unsubscribeSubs.next(true);
    this.unsubscribeSubs.complete();
  }
}
