import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { AppService } from './app.service';

import * as vex from 'vex-js';
import * as vexDialog from 'vex-dialog';
import { PushNotifyService } from './push-notify.service';
import { Socket2Service } from './socket2.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router, 
    private appService: AppService, 
    private storage: StorageMap, 
    // private pushnotifyService: PushNotifyService,
    private socketService2: Socket2Service,
  ) {
    // Registering Vex Dialog Plugin only once through out the project
    vex.registerPlugin(vexDialog);
    vex.defaultOptions.className = 'vex-theme-default';
    
  }

  ngOnInit() {
    // this.pushnotifyService.requestPermission();


    // Set logout timer when page gets refresh, if user is logged in.
    // if (sessionStorage.getItem('CORE_SESSION')) {
    //   this.appService.observeInternetConn(); // Observe Internet Connection
    //   this.appService.autoLogOut();
    // } else {
    //   this.appService.logOut();
    // }


    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
