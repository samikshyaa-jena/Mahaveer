import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgbTabsetModule } from "@ng-bootstrap/ng-bootstrap";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { SharedModule } from "src/app/theme/shared/shared.module";

// Material
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';


import { PaymentComponent } from "./payment.component";
// import { CashdepositComponent } from './cashdeposit/cashdeposit.component';
import { BankchallanComponent } from './bankchallan/bankchallan.component';
import { CdmComponent } from './cdm/cdm.component';
// import { UpiComponent } from './upi/upi.component';
import { VirtualaccountComponent } from './virtualaccount/virtualaccount.component';
import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
// import { AddviewaccountComponent } from './upi/addviewaccount/addviewaccount.component';

const routes: Routes = [
    {
        path: '',
        component: PaymentComponent
    },
    // {
    //     path: 'addviewaccount',
    //     component: AddviewaccountComponent
    // }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        NgbTabsetModule,
        OwlDateTimeModule, OwlNativeDateTimeModule,
        MatInputModule,
        MatIconModule,
        MatAutocompleteModule,
        MatExpansionModule,
        MatSelectModule,
        MatProgressBarModule
    ],
    declarations: [
        PaymentComponent,
        // CashdepositComponent,
        BankchallanComponent,
        CdmComponent,
        // UpiComponent,
        VirtualaccountComponent,
        PaymentgatewayComponent,
        // AddviewaccountComponent
    ]
})
export class PaymentModule {}