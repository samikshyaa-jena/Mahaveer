import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { CountdownModule } from 'ngx-countdown';
import { DMTGuard } from './DMTGuard.guard';
import { FeatureErrorComponent } from './feature-error/feature-error.component';
import { FundtransferComponent } from './fundtransfer3/fundtransfer.component';


const routes: Routes = [
  {
    path: '',
    component: FundtransferComponent,
    canActivate: [DMTGuard]
  },
  {
    path: 'forbidden',
    component: FeatureErrorComponent
  }
];

@NgModule({
  declarations: [
    FundtransferComponent,
    FeatureErrorComponent
  ],
  imports: [
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSliderModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    CountdownModule
  ],
})
export class FundtransferModule { }
