import {Component, OnInit} from '@angular/core';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';

import jwt_decode from 'jwt-decode';
import * as vex from 'vex-js';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {

  walletBalance = 0;
  // notifications = <any>[];
  notiResponse: any;
  fetchingNotifs = false;
  showNotifs = false;
  notiApiFeed = {
    "product_name":"Global",
    "user_name":'',
    type: '',
    page: 1,
    "limit":"10"    
  };
  userName: any;

  constructor(
    private appService: AppService,
    private ngxSpinner: NgxSpinnerService
  ) { }

  ngOnInit() { 
    let dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));
    this.userName = dashboardData.userInfo.userName;
    
    

  //   this.notifications.push({
  //     "message":{
  //        "amount":"",
  //        "product_name":"DMT",
  //        "transactionId":"4540649427574784",
  //        "status":"FAILED",
  //        "status_desc":"NA",
  //        "created_date":"2021-03-25 12:40:10",
  //        "updated_date":"2021-03-25 12:40:14",
  //        "last_notify_time":"2021-03-25 12:40:14",
  //        "transaction_type":"DMT",
  //        "Operation_Performed":"FN_FUND_TRANSFER"
  //     },
  //     "_id":"605c3758074bf7000e64994d",
  //     "CreatedDate":"2021-03-25T07:10:16.183Z",
  //     "User_id":"488",
  //     "User_name":"itpl",
  //     "product_name":"DMT",
  //     "__v":0
  //  });

    const tokenData: {sub: string} = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
    this.notiApiFeed.user_name = tokenData.sub;

    this.appService.walletBalance.subscribe(
      val => {
        console.log('Wallet Balance in Navbar: ', val);
        this.walletBalance = val;
      }
    );

    this.loadingNotifications();
  }

  fetchWallet() {
    this.ngxSpinner.show('walletSpinner', { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    this.appService.fetchWalletBalance();
  }

  logOutApp() {
    this.appService.logOut();
  }

  selectiveNotifications(type = null, page = null) {
    // console.log('Type: ', type);
    // console.log('Page: ', page);

    if (!this.fetchingNotifs) {
      if (type !== null) { this.notiApiFeed.type = type };
      if (page !== null) { this.notiApiFeed.page = page };
  
      this.pullNotifications();
    }

  }

  pullNotifications() {

    // Call Api, only when notification pop up is opened.
    if (this.showNotifs) {

      this.fetchingNotifs = true;
      this.appService.fetchNotifications(this.notiApiFeed)
      .pipe(finalize(() => { 
        this.fetchingNotifs = false;
      }))
      .subscribe(
        (res: any) => {
          console.log('Notifications API Res: ', res);
          this.notiResponse = res;
        },
        (err: any) => {
          console.log('Notifications API Error: ', err);
          console.log('Notifications API Error Status: ', err.status);
          this.showNotifs = false; // Reset Notification Flag
          vex.dialog.alert({
              unsafeMessage: `
                  <div class="d-flex flex-column">
                      <b>Notification Fetching Failed.</b>
                      <small>${err.message}</<small>
                  </div>
              `
          });
        }
      );

    }
  }

  loadingNotifications() {
    const notiContainer = document.querySelector('.noti-body');
    // console.log('Noti Container: ', notiContainer);
    // console.log('Docu Element: ', document.documentElement);

    
    // notiContainer.addEventListener('scroll', () => {
    //   const { scrollTop, scrollHeight, clientHeight } = notiContainer;
    //   console.log('Scroll Top: ', scrollTop);
    //   console.log('Scroll Top Rounded: ', Math.floor(scrollTop));
    //   console.log('Scroll Height: ', scrollHeight);
    //   console.log('Client Height: ', clientHeight);
    //   console.log('Notification Container Scrolled.');

    //   if ((scrollHeight !== 400) && (Math.floor(scrollTop) + clientHeight) === scrollHeight && ('next' in this.notiResponse.data)) {
    //     console.log('Fetched Due to scroll event.');
    //   // if ((Math.floor(scrollTop) + clientHeight) >= (scrollHeight - 5) && ('next' in this.notiResponse.data)) {
    //     this.selectiveNotifications(...[null, this.notiResponse.data.next.page]);
    //   }

    //   // if ('next' in this.notiResponse.data) {
    //   //   this.selectiveNotifications(...[null, this.notiResponse.data.next.page]);
    //   // }
    // });
  }
}
