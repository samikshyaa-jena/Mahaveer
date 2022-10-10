import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, fromEvent, Subject } from "rxjs";

import { StorageMap } from "@ngx-pwa/local-storage";
import jwt_decode from 'jwt-decode';
import { AuthConfig } from 'src/app/app-config';
import * as vex from 'vex-js';
import { finalize, takeUntil } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { Socket2Service } from "./socket2.service";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  walletBalance = new BehaviorSubject(0);
  logOutTimer: any = undefined;
  constructor(
    private router: Router,
    private storage: StorageMap,
    private http: HttpClient,
    private ngxSpinner: NgxSpinnerService,
    private socket2Service: Socket2Service
  ) { }

  autoLogOut() {
    vex.closeAll(); // Close all vex dialogs
    const tokenData: { exp: number } = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
    const startDate = new Date();
    const expDate = new Date(tokenData.exp * 1000);
    const session = Math.ceil((<any>expDate - <any>startDate));

 

    // Clear the Previous timeout before instatntiating another. Useful for preventing multiple instances of Timeout.
    if (this.logOutTimer) {
      clearTimeout(this.logOutTimer);
    }

    this.logOutTimer = setTimeout(() => {
      window.removeEventListener('offline', this.handleOffline, true);

      console.clear(); // Clear the Console.
      sessionStorage.clear();
      this.storage.clear().subscribe(() => { });
      this.router.navigate(['/']);
    }, session);
  }

  logOut() {
    window.removeEventListener('offline', this.handleOffline, true);

    console.clear(); // Clear the Console.
    vex.closeAll(); // Close all vex dialogs
    sessionStorage.clear();
    this.storage.clear().subscribe(() => { });
    this.router.navigate(['/']);
  }

  fetchNotifications(notiReqBody: any) {
    return this.http.post('https://unifiedfcmhub-vn3k2k7q7q-uc.a.run.app/fetch_notification', notiReqBody);
  }

  observeInternetConn() {
    console.log('Checking Internet Offline Status');

    window.addEventListener('offline', this.handleOffline, true);
  }

  handleOffline = (evt) => {
    console.log('Internet Disconnected.')
    if (this.socket2Service.isConnected) {
      this.socket2Service.disconnectSocket();
    }
  }
}
