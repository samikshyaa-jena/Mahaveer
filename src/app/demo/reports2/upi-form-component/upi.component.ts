import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Output, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-upi-trans-report',
  templateUrl: './upi.component.html',
  styleUrls: ['./upi.component.scss']
})
export class UpiTransComponent implements OnInit, OnDestroy {
  reportForm: FormGroup;
  today = new Date();
  minimumDate = new Date();
  todateformat = new Date();
  @Output() upiData = new EventEmitter();
  unsubscribeSubs = new Subject();

  constructor(
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    // Setting Minimum Date of the Calendar to be 2 months back from Today.
    this.minimumDate.setMonth(this.today.getMonth() - 2);

    this.reportForm = new FormGroup({
      subCat: new FormControl('upi', null),
      operationPerformed: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      dateRange: new FormControl([this.today, this.today], Validators.required)
    });

    this.subscribeDateRange();
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
    // UPI form submit function added by Akshaya
    let reportData = {};
    const { dateRange, operationPerformed, status } = this.reportForm.value;
    const {userInfo: {userName}} = JSON.parse(sessionStorage.getItem('dashboardData'));
      this.todateformat.setDate(dateRange[1].getDate() + 1);
      reportData = {
        start_date: this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
        end_date: this.datePipe.transform(this.todateformat, 'yyyy-MM-dd'),
        transaction_type: ['UPI'],
        operationPerformed: operationPerformed === 'all' ? ["QR_COLLECT", "UPI_COLLECT", "QR_STATIC"] : [operationPerformed],
        userName,
        status: status
      };
    this.upiData.emit({type: 'upi', data: reportData});
  }

  ngOnDestroy() {
    this.unsubscribeSubs.next(true);
    this.unsubscribeSubs.complete();
  }

}
