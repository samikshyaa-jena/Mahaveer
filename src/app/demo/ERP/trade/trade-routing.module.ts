import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebitNoteComponent } from './purchase/debit-note/debit-note.component';
import { CatagoryComponent } from './catagory/catagory.component';
import { CustomerComponent } from './customer/customer.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { CreditNoteComponent } from './sale/credit-note/credit-note.component';
import { SaleComponent } from './sale/sale.component';
import { StockComponent } from './stock/stock.component';
import { VendorComponent } from './vendor/vendor.component';
import { QuotationComponent } from './quotation/quotation.component';
import { InvoiceComponent } from '../../../theme/shared/invoice/invoice.component';
// import { InvoiceComponent } from 'src/app/theme/shared/invoice/invoice.component';


const routes: Routes = [
  {
    path: 'catagory',
    component: CatagoryComponent
  },
  {
    path: 'customer',
    component: CustomerComponent
  },
  {
    path: 'purchase',
    component: PurchaseComponent
  },
  {
    path: 'trade_debit',
    component: DebitNoteComponent
  },
  {
    path: 'stock',
    component: StockComponent
  },
  {
    path: 'vendor',
    component: VendorComponent
  },
  {
    path: 'sale',
    component: SaleComponent
  },
  {
    path: 'quotation',
    component: QuotationComponent
  },
  {
    path: 'sale-quotation',
    component: QuotationComponent
  },
  {
    path: 'credit',
    component: CreditNoteComponent
  },
  {
    path: 'invoice',
    component: InvoiceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule { }
