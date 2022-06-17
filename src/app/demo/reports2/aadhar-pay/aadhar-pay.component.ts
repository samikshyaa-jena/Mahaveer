import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-aadhar-pay',
  templateUrl: './aadhar-pay.component.html',
  styleUrls: ['./aadhar-pay.component.scss']
})
export class AadharPayComponent implements OnInit {
  reportForm: FormGroup;
  today = new Date();
  minimumDate = new Date();
  @Output() adharData = new EventEmitter();
  unsubscribeSubs = new Subject();
  constructor(
    private datePipe: DatePipe, 
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.minimumDate.setMonth(this.today.getMonth() - 2);
    this.reportForm = new FormGroup({
      status: new FormControl('All', null),
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
        (diffDays >= 10) ? this.reportForm.get('dateRange').setErrors({incorrect: true}) :  this.reportForm.get('dateRange').setErrors(null);
      }
    );
  }
  submitReport() {
    let reportData = {};
    const { dateRange, status} = this.reportForm.value;
    const {userInfo: {userName}} = JSON.parse(sessionStorage.getItem('dashboardData'));
    console.log(dateRange, status, "nnnnnnnnnnnnnnnnnnnnnnnn");
    
    // console.log('Storage Service Data: ', this.storageService.getData('dashboardDataz'));
   
    reportData = 
    {
      "start_date":this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
      "end_date":this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
      "userName":userName,
      "transaction_type":["AEPS3"],
      "operationPerformed":["AADHAAR_PAY"],
      "status":status
    };

    this.adharData.emit({type: 'aadhar', data: { reportData }});
  }

  ngOnDestroy() {
    this.unsubscribeSubs.next(true);
    this.unsubscribeSubs.complete();
  }

}
