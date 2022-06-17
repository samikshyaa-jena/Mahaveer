import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Output, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReportsService } from "../reports.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import * as vex from 'vex-js';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-wallet-trans-report',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletTransComponent implements OnInit, OnDestroy {
  reportForm: FormGroup;
  today = new Date();
  minimumDate = new Date();
  usernameList = <any>[];
  userRole: string;
  matchData: any;
  @Output() walletData = new EventEmitter();
  unsubscribeSubs = new Subject();

  constructor(
    private reportService: ReportsService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    // Setting Minimum Date of the Calendar to be 2 months back from Today.
    this.minimumDate.setMonth(this.today.getMonth() - 2);
    const {userInfo: {userType}} = JSON.parse(sessionStorage.getItem('dashboardData'));
    this.userRole = userType;

    const tokenData: {sub: string} = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
    switch (this.userRole) {
      case 'ROLE_ADMIN':
        this.matchData = { "parent_a":{ "query":tokenData.sub } };
        break;

      default:
        this.matchData = {};
        break;
    }

    if (this.userRole === 'ROLE_ADMIN') {
      this.reportForm = new FormGroup({
        subCat: new FormControl('my_wallet1', null),
        userName: new FormControl('', null),
        dateRange: new FormControl([this.today, this.today], Validators.required)
      });

      this.observeUserName();
    } else {
      this.reportForm = new FormGroup({
        subCat: new FormControl('my_wallet1', null),
        dateRange: new FormControl([this.today, this.today], Validators.required)
      });
    }

    this.subscribeDateRange();
  }

  observeUserName() {
    this.reportForm.get('userName').valueChanges
    .pipe(takeUntil(this.unsubscribeSubs))
    .subscribe(
      val => {
        if (val) {
          this.searchUsers(val)
        } else {
          this.usernameList = [];
        }

      }
    );
  }

  searchUsers(e: any) {
    const data = {
      "size":10000,
      "from":0,
      "query":{
         "bool":{
            "must":[
               {
                  "match": this.matchData
               }
            ],
            "filter":{
               "multi_match":{
                  "query": e,
                  "type":"phrase_prefix",
                  "fields":[
                     "user_name",
                     "mobile_no",
                     "name"
                  ],
                  "lenient":true
               }
            }
         }
      }
   };

   this.reportService.eUsersAPI(data).subscribe(
     (res: any) => {
      // console.log('Elastic Users List Response: ', res);
      // console.log('Elastic Users List: ', res.hits.hits.map((hit: any) => { return { userName: hit._source.user_name, userId: hit._source.user_id, name: hit._source.name, mobile: hit._source.mobile_no }; }));
      this.usernameList = res.hits.hits.map((hit: any) => { return { userName: hit._source.user_name, userId: hit._source.user_id, name: hit._source.name, mobile: hit._source.mobile_no }; });
     },
     (err: any) => {
      console.log('Elastic Users List Error: ', err);
     }
   );

  }

  subscribeDateRange() {
    this.reportForm.get('dateRange').valueChanges
    .pipe(takeUntil(this.unsubscribeSubs))
    .subscribe(
      val => {
        const [start, end] = val;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffDays = Math.ceil((<any>endDate - <any>startDate) / (1000 * 60 * 60 * 24));
        (diffDays >= 10) ? this.reportForm.get('dateRange').setErrors({ incorrect: true }) : this.reportForm.get('dateRange').setErrors(null);
      }
    );
  }

  autoDisplay(user: any) {
    console.log('User: ', user);
    return user ? user.userName : undefined;
  }

  submitReport() {
    // Cashout form submit function added by Akshaya
    let reportData = <any>{};
    const {userInfo: {userName}} = JSON.parse(sessionStorage.getItem('dashboardData'));
    const { dateRange } = this.reportForm.value;

    switch(this.reportForm.get('subCat').value) {
      case 'my_wallet1':
        reportData = {
          "$1":"new_wallet",
          "$4":this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
          "$5":this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
          "$2": userName,
          "$7":[
             "FN_FUND_TRANSFER"
          ]
        };
        break;

      case 'user_wallet1':
        let user = this.reportForm.get('userName').value;
        reportData = {
          "$1":"new_wallet",
          "$4":this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
          "$5":this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
          "$2": user.userName,
          "$7":[
             "FN_FUND_TRANSFER"
          ]
        };
        break;

      default:
        reportData = {
          startDate: this.datePipe.transform(dateRange[0], 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(dateRange[1], 'yyyy-MM-dd'),
          userName
        };
        break;
    }

    console.log('Report Request Body: ', reportData);

    if ((this.userRole === 'ROLE_ADMIN') && (this.reportForm.get('subCat').value === 'user_wallet1')) {
      if (!reportData["$2"]) {  
        vex.dialog.alert('Please, choose an user from the user list.')
        return;
      }
    }
    this.walletData.emit({type: 'wallet', data: reportData, wType: this.reportForm.get('subCat').value});
  }

  ngOnDestroy() {
    this.unsubscribeSubs.next(true);
    this.unsubscribeSubs.complete();
  }
}
