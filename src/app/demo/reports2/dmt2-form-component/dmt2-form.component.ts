import { DatePipe } from "@angular/common";
import { Component, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { StorageService } from "src/app/storage.service";

@Component({
  selector: 'app-dmt2-form',
  templateUrl: './dmt2-form.component.html',
  styleUrls: ['./dmt2-form.component.scss']
})
export class Dmt2FormComponent implements OnInit, OnDestroy {
  reportForm: FormGroup;
  today = new Date();
  minimumDate = new Date();
  @Output() dmt2Data = new EventEmitter();
  unsubscribeSubs = new Subject();

  constructor(private datePipe: DatePipe, private storageService: StorageService) { }

  ngOnInit() {
    this.minimumDate.setMonth(this.today.getMonth() - 2);

    this.reportForm = new FormGroup({
      subCat: new FormControl('ALL', null),
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
    const { dateRange, subCat } = this.reportForm.value;
    const {userInfo: {userName}} = JSON.parse(sessionStorage.getItem('dashboardData'));
    // console.log('Storage Service Data: ', this.storageService.getData('dashboardDataz'));
    const selCats = ["INITIATED","RETRY","INPROGRESS","SUCCESS","FAILED","REFUNDED"].filter(cat => {
      if (subCat === 'ALL') { return true; }
      return cat === subCat;
    });
    reportData = {
      //"_comment1": "$1=>queryoperation, $2=>username, $3=>status, $4=> startDate, $5=>endDate, $6=>transaction_type, $7=>operationPerformed",
      "$1": "new_dmt_report",
      "$2": userName,
      "$3": selCats,
      "$4": this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
      "$5": this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
      "$6": ["DMT"],
      "$7": ["FN_FUND_TRANSFER", "FN_BENE_VERIFICATION"]
    };

    this.dmt2Data.emit({type: 'dmt2', data: {reportData, retry: subCat === "RETRY" ? true : false }});
  }

  ngOnDestroy() {
    this.unsubscribeSubs.next(true);
    this.unsubscribeSubs.complete();
  }

}
