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
    path: 'credit',
    component: CreditNoteComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule { }
