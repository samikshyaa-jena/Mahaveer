import { DatePipe } from "@angular/common";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as $ from 'jquery'

@Component({
    selector: 'app-aeps-trans-report',
    templateUrl: './aeps.component.html',
    styleUrls: ['./aeps.component.scss']
})
export class AepsTransComponent implements OnInit, OnDestroy {
    reportForm: FormGroup;
    today = new Date();
    minimumDate = new Date();
    @Output() aepsData = new EventEmitter();
    unsubscribeSubs = new Subject();
    public selected = 'option1';
    modeselect:any
    constructor(
        private datePipe: DatePipe
    ) {}

    ngOnInit() {
        // Setting Minimum Date of the Calendar to be 2 months back from Today.
        this.modeselect = "option1";
    }

    



    ngOnDestroy() {
      this.unsubscribeSubs.next(true);
      this.unsubscribeSubs.complete();
    }
}