// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Routes } from '@angular/router';




import { AadharPayComponent } from './aadhar-pay/aadhar-pay.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import {MatRadioModule, MatButtonToggleModule} from '@angular/material';
import { CountdownModule } from 'ngx-countdown';
// import { AepsComponent } from './aeps/aeps.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material';
import { Socket3Service } from './../../../app/socket3.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AgmCoreModule } from '@agm/core';
// import { BioAuthComponent } from './bio-auth/bio-auth.component';
// import { AepsStagComponent } from './aeps-stag/aeps-stag.component';

const routes: Routes = [
  
  {
    path: '**',
    component: AadharPayComponent,
  }
  
];

@NgModule({
  declarations: [AadharPayComponent],
  // imports: [
  //   RouterModule.forChild(routes),
  //   CommonModule
  // ]


  imports: [
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSliderModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    CountdownModule,
    MatTabsModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatProgressBarModule,
    AngularFireModule,
    AngularFirestoreModule,
    MatButtonToggleModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDRFjW0vNm_vvcaspgCXhdcBOPJeLcaPJU'
    })
  ],
  providers: [
    Socket3Service,
  ],
})
export class AadharPayModule { }
