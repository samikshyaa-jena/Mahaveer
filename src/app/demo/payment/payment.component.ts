import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AuthConfig } from "src/app/app-config";
import { PaymentApi } from "./payment.api";
import { PaymentService } from "./payment.service";

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
    paymentForm: FormGroup;
    minDate = new Date();
    maxDate = new Date();

    constructor(
        private paymentService: PaymentService
    ) {}

    ngOnInit() {
        const today = new Date();
        this.minDate.setDate(today.getDate() - 7);
        this.maxDate.setDate(today.getDate() - 1);
        this.getWalletBalanceData();

        this.paymentForm = new FormGroup({
            depositIn: new FormControl('ANDHRA', null),
            paymentmode: new FormControl('NEFT', null),
            depositDate: new FormControl(this.minDate, null),
            amount: new FormControl('', null),
            bankname: new FormControl('', null),
            accountNo: new FormControl('', null),
            bankRefId: new FormControl('', null),
            receipt: new FormControl('', null),
            remark: new FormControl('', null),

        });
    }

    async getWalletBalanceData() {
        const { userInfo: { userName } } = JSON.parse(sessionStorage.getItem('dashboardData'));

        const encUrl = await AuthConfig.config.encodeUrl(PaymentApi.url.wBalData);

        this.paymentService.postReqs(encUrl, {userName}).subscribe(
            (res: any) => {
                console.log('Wallet Balance Response: ', res);
            },
            (err: any) => {
                console.log('Wallet Balance Error: ', err);
            }
        );
    }

    checkForm() {
        console.log('This Form: ', this.paymentForm.value);
    }
}
