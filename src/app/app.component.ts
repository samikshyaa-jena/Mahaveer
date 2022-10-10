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
    private socketService2: Socket2Service,
  ) {
    vex.registerPlugin(vexDialog);
    vex.defaultOptions.className = 'vex-theme-default';
    
  }

  ngOnInit() {


    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
