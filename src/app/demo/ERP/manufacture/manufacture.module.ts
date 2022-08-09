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
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ReqEntryComponent } from './product/req-entry/req-entry.component';
import { ReqEditComponent } from './product/req-edit/req-edit.component';
import { AddProductionComponent } from './add-production/add-production.component';
import { ScrapComponent } from './scrap/scrap.component';
import { ScrapConsumptionComponent } from './add-production/scrap-consumption/scrap-consumption.component';
import { ProdEntryComponent } from './add-production/prod-entry/prod-entry.component';
import { MatAutocompleteModule, MatIconModule } from "@angular/material";


@NgModule({
  declarations: [CatagoryComponent, VendorComponent, PurchaseComponent, StockComponent, ProductComponent, PurchaseAddComponent, DebitNoteComponent, ReqEntryComponent, ReqEditComponent, AddProductionComponent, ScrapComponent, ScrapConsumptionComponent, ProdEntryComponent],
  imports: [
    CommonModule,
    ManufactureRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatAutocompleteModule,
    MatIconModule,
  ]
})
export class ManufactureModule { }
