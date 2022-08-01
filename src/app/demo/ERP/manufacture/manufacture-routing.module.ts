import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddProductionComponent } from './add-production/add-production.component';
import { ScrapConsumptionComponent } from './add-production/scrap-consumption/scrap-consumption.component';
import { CatagoryComponent } from './catagory/catagory.component';
import { ProductComponent } from './product/product.component';
import { DebitNoteComponent } from './purchase/debit-note/debit-note.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { ScrapComponent } from './scrap/scrap.component';
import { StockComponent } from './stock/stock.component';
import { VendorComponent } from './vendor/vendor.component';


const routes: Routes = [
  {
    path: 'catagory',
    component: CatagoryComponent
  },
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'purchase',
    component: PurchaseComponent
  },
  {
    path: 'debit',
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
    path: 'addproduct',
    component: AddProductionComponent
  },
  {
    path: 'scrap',
    component: ScrapComponent
  },
  {
    path: 'scrapcons',
    component: ScrapConsumptionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManufactureRoutingModule { }
