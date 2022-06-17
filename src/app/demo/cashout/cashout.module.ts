import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SharedModule } from "src/app/theme/shared/shared.module";
import { Wallet1Component } from "./wallet1/wallet1.component";
import { Wallet2Component } from "./wallet2/wallet2.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'wallet1'
    },
    {
        path: 'wallet1',
        component: Wallet1Component
    },
    {
        path: 'wallet2',
        component: Wallet2Component
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        CommonModule,
        OwlDateTimeModule, OwlNativeDateTimeModule,
        NgxDatatableModule
    ],
    declarations: [
        Wallet1Component,
        Wallet2Component
    ]
})
export class CashoutModule {}