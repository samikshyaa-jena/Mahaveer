import { DatePipe } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { finalize } from "rxjs/operators";
import { AuthConfig } from "src/app/app-config";
import { CashoutApi } from "../cashout.api";
import { CashoutService } from "../cashout.service";

@Component({
    selector: 'app-cashout-wallet1',
    templateUrl: './wallet1.component.html',
    styleUrls: ['./wallet1.component.scss']
})
export class Wallet1Component implements OnInit {
    wallet1Form: FormGroup;
    today = new Date();
    reports = [];
    tableCols = [];
    reportsSource = [];
    fetchingReport = false;
    @ViewChild('checkTemplate', { static: false }) checkTemplate: TemplateRef<any>;
    @ViewChild('actionTemplate', { static: false }) actionTemplate: TemplateRef<any>;
    @ViewChild('dateTemplate', { static: false }) dateTemplate: TemplateRef<any>;

    constructor(
        private datePipe: DatePipe,
        private cashoutService: CashoutService
    ) {}

    ngOnInit() {
        const startDate = new Date();
        startDate.setDate(this.today.getDate() - 7);

        this.wallet1Form = new FormGroup({
            dateRange: new FormControl({value: [startDate, this.today], disabled: true}, null),
            transactionType: new FormControl('', Validators.required)
        });
    }

    async submitReport() {
        this.fetchingReport = true;
        const { dateRange, transactionType } = this.wallet1Form.getRawValue();

        const wallet1Data = {
            fromDate: this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
            toDate: this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
            transactionType
        };

        const encurlw1 = await AuthConfig.config.encodeUrl(CashoutApi.url.wallet1);

        this.cashoutService.wallet1API(encurlw1, wallet1Data)
        .pipe(finalize(() => { this.fetchingReport = false; }))
        .subscribe(
            (res: any) => {

                this.reportsSource = this.reports = res.bqreport;
                if (this.reports.length) {
                  this.tableCols = Object.keys(this.reports[0]).map((col) => {
                    switch(col) {
                      case 'Id':
                        return { prop: col };
          
                      case 'status':
                        return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };
        
                      case 'createdDate':
                      case 'updatedDate':
                        return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };
          
                      default:
                        return { name: col.replace(/([A-Z])/g, ' $1') };
                    }
                    
                  });
                  this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
                }
            },
            (err: any) => {
                console.log('Wallet1 API Error: ', err);
            }
        );

    }


}