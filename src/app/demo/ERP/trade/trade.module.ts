import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradeRoutingModule } from './trade-routing.module';
import { CatagoryComponent } from './catagory/catagory.component';
import { VendorComponent } from './vendor/vendor.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { StockComponent } from './stock/stock.component';
import { SaleComponent } from './sale/sale.component';
import { CustomerComponent } from './customer/customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SaleAddComponent } from './sale/sale-add/sale-add.component';
import { CreditNoteComponent } from './sale/credit-note/credit-note.component';
import { PurchaseAddComponent } from './purchase/purchase-add/purchase-add.component';
import { DebitNoteComponent } from './purchase/debit-note/debit-note.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { QuotationComponent } from './quotation/quotation.component';
import { QuotationEntryComponent } from './quotation/quotation-entry/quotation-entry.component';


@NgModule({
  declarations: [CatagoryComponent, VendorComponent, PurchaseComponent, StockComponent, SaleComponent, CustomerComponent, SaleAddComponent, CreditNoteComponent, PurchaseAddComponent, DebitNoteComponent, QuotationComponent, QuotationEntryComponent],
  imports: [
    CommonModule,
    TradeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class TradeModule { }
