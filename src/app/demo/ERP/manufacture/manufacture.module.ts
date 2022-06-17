import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManufactureRoutingModule } from './manufacture-routing.module';
import { CatagoryComponent } from './catagory/catagory.component';
import { VendorComponent } from './vendor/vendor.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { StockComponent } from './stock/stock.component';
import { ProductComponent } from './product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseAddComponent } from './purchase/purchase-add/purchase-add.component';
import { DebitNoteComponent } from './purchase/debit-note/debit-note.component';


@NgModule({
  declarations: [CatagoryComponent, VendorComponent, PurchaseComponent, StockComponent, ProductComponent, PurchaseAddComponent, DebitNoteComponent],
  imports: [
    CommonModule,
    ManufactureRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ]
})
export class ManufactureModule { }
