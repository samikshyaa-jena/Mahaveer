import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-unified-aeps',
  templateUrl: './unified-aeps.component.html',
  styleUrls: ['./unified-aeps.component.scss']
})
export class UnifiedAepsComponent implements OnInit {

  reportForm: FormGroup;
  today = new Date();
  minimumDate = new Date();
  @Output() unifiedData = new EventEmitter();
  unsubscribeSubs = new Subject();
  op_perform = <any>[];
  constructor(
    private datePipe: DatePipe, 
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.minimumDate.setMonth(this.today.getMonth() - 2);
    this.reportForm = new FormGroup({
      status: new FormControl('All', null),
      subCat: new FormControl('All', null),
      dateRange: new FormControl([this.today, this.today], Validators.required)
    });

    this.op_perform.push('AEPS_CASH_WITHDRAWAL', 'AEPS_BALANCE_ENQUIRY', 'AEPS_MINI_STATEMENT');
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

  operation_perform(evt) {
    this.op_perform.splice(0, this.op_perform.length);
    if (evt == 'All') {
      this.op_perform.push('AEPS_CASH_WITHDRAWAL', 'AEPS_BALANCE_ENQUIRY', 'AEPS_MINI_STATEMENT');
    }
    else {
      this.op_perform.push(this.reportForm.get('operation_per').value);
    }
  }
  
  submitReport() {
    let reportData = {};
    const { dateRange, status } = this.reportForm.value;
    const {userInfo: {userName}} = JSON.parse(sessionStorage.getItem('dashboardData'));
    
    reportData = {
    "operationPerformed": this.op_perform, 
    "start_date":this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
    "end_date":this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
    "status": status,
    "transaction_type": ["UnifiedAEPS"],
    "userName": userName
  };

    this.unifiedData.emit({type: 'unified', data: { reportData }});
  }

  ngOnDestroy() {
    this.unsubscribeSubs.next(true);
    this.unsubscribeSubs.complete();
  }

}
