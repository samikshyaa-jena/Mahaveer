import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './theme/shared/shared.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { MatProgressBarModule } from '@angular/material'
import { ToggleFullScreenDirective } from './theme/shared/full-screen/toggle-full-screen';
/* Menu Items */
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ErrorComponent } from './demo/error/error.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
// FCM Packages
import { PushNotifyService } from './push-notify.service';
// Socket Package
import { Socket2Service } from './socket2.service';
import { DepositslipComponent } from './depositslip/depositslip.component';
import { StorageService } from './storage.service';
import { AgmCoreModule } from '@agm/core';
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    NavigationComponent,
    NavContentComponent,
    NavGroupComponent,
    NavCollapseComponent,
    NavItemComponent,
    NavBarComponent,
    NavLeftComponent,
    NavSearchComponent,
    NavRightComponent,
    ConfigurationComponent,
    ToggleFullScreenDirective,
    ErrorComponent,
    DepositslipComponent,
    //AepsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    HttpClientModule,
    MatDialogModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressBarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDRFjW0vNm_vvcaspgCXhdcBOPJeLcaPJU'
    })
  ],
  providers: [
    NavigationItem, DatePipe, PushNotifyService, Socket2Service, StorageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
