import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradeRoutingModule } from './trade-routing.module';
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
// import { InvoiceComponent } from '../invoice/invoice.component';
import { InvoiceComponent } from '../../../theme/shared/invoice/invoice.component';
import { CategoryComponent } from './catagory/catagory.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ScrapSaleComponent } from './sale/scrap-sale/scrap-sale.component';




@NgModule({
  declarations: [CategoryComponent, VendorComponent, PurchaseComponent, StockComponent, SaleComponent, CustomerComponent, SaleAddComponent, CreditNoteComponent, PurchaseAddComponent, DebitNoteComponent, QuotationComponent, QuotationEntryComponent, InvoiceComponent, ScrapSaleComponent],
  imports: [
    CommonModule,
    TradeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,  
    MatFormFieldModule  
  ]
})
export class TradeModule { }
