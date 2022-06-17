import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { finalize, takeUntil } from "rxjs/operators";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import jwt_decode from 'jwt-decode';

import { ReportsService } from "./reports.service";
import * as vex from 'vex-js';
import { AuthConfig } from 'src/app/app-config';
import { ReportsApi } from './reports.api';
import { NgxSpinnerService } from "ngx-spinner";
import { Socket2Service } from "src/app/socket2.service";
import { Subject } from "rxjs";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe, CurrencyPipe]
})
export class ReportsComponent implements OnInit, OnDestroy {

  reports = [];
  tableCols = [];
  selCols = [];
  reportsSource = [];
  reportType: string;
  fetchingReport = false;
  transferErr = false;
  unsub = new Subject();
  transRecord = <any>{};
  txnDetailReport = { reports: [] };
  retryDataDMT2 = { transData: undefined, reportData: undefined, retryTxnID: undefined, retrying: false };
  searchInput = new FormControl('', null);
  @ViewChild('checkTemplate', { static: false }) checkTemplate: TemplateRef<any>;
  @ViewChild('idTemplate', { static: false }) idTemplate : TemplateRef<any>;
  @ViewChild('gatewayTemplate', { static: false }) gatewayTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: false }) actionTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: false }) dateTemplate: TemplateRef<any>;
  @ViewChild('table', { static: false }) table: DatatableComponent;
  @ViewChild('modalDefault', { static: false }) private txnDetailsModal: any;
  @ViewChild('modalRetry', { static: false }) public retryModal: any;
  @ViewChild('modalSuccess', { static: false }) public transModal: any;
  @ViewChild('modalGateway', { static: false }) public gatewayModal: any;

  socketData = {
    socket_timeout: false,

    amount: 1,
    bene_acc: "487893458948",
    bene_bank: "AXIS BANK",
    bene_ifsc: "UTIB0000004",
    bene_name: "Mahesh",
    created_date: "2021-02-19 11:46:48",
    customer_mobile: "8595138338",
    customer_name: "Prabin Sarab",
    id: 820611392503824,
    operation_performed: "FN_FUND_TRANSFER",
    rrn: "",
    shop_name: "",
    status: "FAILED",
    status_desc: "Call back commit",
    trans_mode: "IMPS",
    update_date: "2021-02-19 11:46:48",
};

  constructor(
    private reportService: ReportsService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private route: ActivatedRoute,
    private ngxSpinner: NgxSpinnerService,
    private socketService2: Socket2Service,
  ) { (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs; }

  ngOnInit() {
    this.route.data.subscribe(
      resolvedData => {
        this.reportType = resolvedData.reportType;
        this.reportsSource = this.reports = [];
      }
    );

    this.observeSocketConn();

  }

  observeSocketConn() {
    this.socketService2.socketConnected
    .pipe(takeUntil(this.unsub))
    .subscribe((socket: any) => {

        if ((socket.type !== 'INIT')) { // Don't listen to initial socket data.
            if (socket.status) {
                console.log('Socket Connected Listened');

                // Make the retry, only when the socket gets connected.
                this.retryTrans(this.retryDataDMT2.retryTxnID);

              // if (this.transferErr) { // If transError, disconnect the socket.
              //   this.socketService2.disconnectSocket();
              // }

            } else {

                console.log('Socket Disconnected Listened');

                // this.loader.general = false;
                this.transferErr = false; // Reset transError to allow socket connection again.
                
            }
        }

    });
  }

  connectSocket() {

    this.socketService2.setupSocket();

    const socketSub = this.socketService2.socketData
    .pipe(takeUntil(this.unsub))
    .subscribe((data: any) => {
      console.log('Socket Data In DMT2 Report: ', data);
      if (data) {
        this.socketData = data;
        this.retryDataDMT2.retrying = false;

        this.reloadRetryTable();

        this.showTransModal(this.socketData.status); // Show the Socket Data in the Modal.
        this.socketService2.socketData.next(null); // Clear the socketData once received.

        socketSub.unsubscribe(); // Unsubscribe socketData to prevent multiple emissions.
        this.socketService2.disconnectSocket(); // Disconnect Socket

      }
    });
  }

  getFormData(e: {type: string, data: any, wType?: any}) {
    this.fetchingReport = true;
    switch (e.type) {
      case 'recharge':
        this.fetchRechargeReport(e.data);
        break;

      case 'dmt':
        this.fetchDmtReport(e.data);
        break;
      
      case 'dmt2':
        this.fetchDmt2Report(e.data);
        break;

      case 'aeps':
        this.fetchAepsReport(e.data);
        break;

      case 'bbps':
        this.fetchBbpsReport(e.data);
        break;

      case 'matm':
        this.fetchMatmReport(e.data);
        break;

      case 'insurance':
        this.fetchInsuranceReport(e.data);
        break;

      case 'cashout':
        this.fetchCashoutReport(e.data);
        break;

      case 'commission':
        this.fetchCommissionReport(e.data);
        break;

      case 'wallet':
        this.fetchWalletReport(e.data, e.wType);
        break;

      case 'upi':
        this.fetchUpiReport(e.data);
        break;
      case 'unified':
        this.fetchunifiedReport(e.data);
        break;
      case 'aadhar':
        this.fetchAadharReport(e.data);
        break;

      default:
        break;
    }
  }


  async fetchRechargeReport(reportData: any) {

    const encURL = reportData.hasOwnProperty('fromDate') ? await AuthConfig.config.encodeUrl(ReportsApi.url.recharge.recharge1) : await AuthConfig.config.encodeUrl(ReportsApi.url.recharge.recharge2);

    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => { this.fetchingReport = false; }))
    .subscribe(
      (res: any) => {
        this.reportsSource = this.reports = reportData.hasOwnProperty('transactionType') ? res.BQReport : res.results.BQReport;
        if (this.reports.length) {
          this.tableCols = Object.keys(this.reports[0]).map((col) => {
            switch(col) {
              case 'Id':
                return { prop: col };
  
              case 'status':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

              case 'createdDate':
              case 'updatedDate':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };
  
              default:
                return { name: col.replace(/([A-Z])/g, ' $1') };
            }
            
          });
          this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
        } else {
          vex.dialog.alert('No Data Found!!');
        }
      },
      (err: any) => {
        console.log('Error: ', err);
        this.reportsSource = this.reports = [];
      }
    );    

  }

  async fetchDmtReport(reportData: any) {

    const encURL = reportData.hasOwnProperty('fromDate') ? await AuthConfig.config.encodeUrl(ReportsApi.url.dmt.all_succ_trans) : await AuthConfig.config.encodeUrl(ReportsApi.url.dmt.refund_trans);

    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => { this.fetchingReport = false; }))
    .subscribe(
      (res: any) => {
        this.reportsSource = this.reports = res.BQReport;
        if (this.reports.length) {
          this.tableCols = Object.keys(this.reports[0]).map((col) => {
            switch(col) {
              case 'Id':
                return { prop: col };
  
              case 'status':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

              case 'createdDate':
              case 'updatedDate':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };
  
              default:
                return { name: col.replace(/([A-Z])/g, ' $1') };
            }
            
          });
          this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
        } else {
          vex.dialog.alert('No Data Found!!');
        }
      },
      (err: any) => {
        console.log('Error: ', err);
        this.reportsSource = this.reports = [];
      }
    );    

  }

  async fetchDmt2Report(dmt2Data: { reportData: any, retry: boolean }) {
    this.retryDataDMT2.reportData = dmt2Data;
    const encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.dmt2.all_trans);
    this.reportService.transactionAPI(encURL, dmt2Data.reportData)
    .pipe(finalize(() => { this.fetchingReport = false; }))
    .subscribe(
      (res: any) => {
        this.reportsSource = this.reports = res.Report;
        if (this.reports.length) {
          this.tableCols = Object.keys(this.reports[0]).map((col) => {
            switch(col) {
              case 'Id':
                return { prop: col, cellTemplate: this.idTemplate };

              case 'status':
                  return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

              case 'gateWayData':
                  return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.gatewayTemplate };

              case 'createdDate':
              case 'updatedDate':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };

              case 'param_a' :
              case 'param_b' :
              case 'param_c' :
                return { name: col.replace(/([A-Z])/g, ' $1'), prop: col };

              default:
                return { name: col.replace(/([A-Z])/g, ' $1') };
            }
          });
          this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate, cellClass: 'action-cell-class', prop: `${dmt2Data.retry}`});
          this.selCols = this.tableCols;
          // console.log('Selected Cols: ', this.selCols);
        } else {
          vex.dialog.alert('No Records Found!!');
        }
      },
      (err: any) => {
        console.log('Error: ', err);
        this.reportsSource = this.reports = [];
        vex.dialog.alert('Some error occured, while fetching records. Please, try again.');
      });
    }


  async fetchAepsReport(reportData: any) {

    const encURL = reportData.subcatVal == 'aeps1' ? await AuthConfig.config.encodeUrl(ReportsApi.url.aeps.aeps1) : await AuthConfig.config.encodeUrl(ReportsApi.url.aeps.aeps2);

    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => { this.fetchingReport = false; }))
    .subscribe(
      (res: any) => {
        this.reportsSource = this.reports = res.hasOwnProperty('results') ? res.results.BQReport : res.BQReport;
        if (this.reports.length) {
          this.tableCols = Object.keys(this.reports[0]).map((col) => {
            switch(col) {
              case 'Id':
                return { prop: col };
  
              case 'status':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

              case 'createdDate':
              case 'updatedDate':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };
  
              default:
                return { name: col.replace(/([A-Z])/g, ' $1') };
            }
            
          });
          this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
        } else {
          vex.dialog.alert('No Data Found!!');
        }
      },
      (err: any) => {
        console.log('Error: ', err);
        this.reportsSource = this.reports = [];
      }
    );    

  }


  async fetchMatmReport(reportData: any) {

    const encURL = reportData.hasOwnProperty('fromDate') ? await AuthConfig.config.encodeUrl(ReportsApi.url.matm.matm1) : await AuthConfig.config.encodeUrl(ReportsApi.url.matm.matm2);

    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => { this.fetchingReport = false; }))
    .subscribe(
      (res: any) => {
        this.reportsSource = this.reports = res.hasOwnProperty('results') ? res.results.BQReport : res.BQReport;
        if (this.reports.length) {
          this.tableCols = Object.keys(this.reports[0]).map((col) => {
            switch(col) {
              case 'Id':
                return { prop: col };
  
              case 'status':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

              case 'createdDate':
              case 'updatedDate':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };
  
              default:
                return { name: col.replace(/([A-Z])/g, ' $1') };
            }
            
          });
          this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
        } else {
          vex.dialog.alert('No Data Found!!');
        }
      },
      (err: any) => {
        console.log('Error: ', err);
        this.reportsSource = this.reports = [];
      }
    );    

  }


  async fetchBbpsReport(reportData: any) {

    const encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.bbps);

    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => { this.fetchingReport = false; }))
    .subscribe(
      (res: any) => {
        this.reportsSource = this.reports = res.results.BQReport;
        if (this.reports.length) {
          this.tableCols = Object.keys(this.reports[0]).map((col) => {
            switch(col) {
              case 'Id':
                return { prop: col };
  
              case 'status':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

              case 'createdDate':
              case 'updatedDate':
                return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };
  
              default:
                return { name: col.replace(/([A-Z])/g, ' $1') };
            }
            
          });
          this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
        } else {
          vex.dialog.alert('No Data Found!!');
        }
      },
      (err: any) => {
        console.log('Error: ', err);
        this.reportsSource = this.reports = [];
      }
    );    

  }

  async fetchInsuranceReport(reportData: any) {

    const encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.insurance);

    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => {this.fetchingReport = false;}))
    .subscribe((res: any) => {
      this.reportsSource = this.reports = res.results.BQReport;
      if(this.reports.length) {
        this.tableCols = Object.keys(this.reports[0]).map((col) => {
          switch(col) {
            case 'Id':
              return { prop: col };

            case 'status':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

            case 'createdDate':
            case 'updatedDate':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };

            default:
              return { name: col.replace(/([A-Z])/g, ' $1') };
          }
        });
        this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
      }
    },
    (err: any) => {
      console.log('Error: ', err);
      this.reportsSource = this.reports = [];
    })
  };

  async fetchCashoutReport(reportData: any) {
    let encURL = '';
    (reportData.subcatVal == 'aeps' || reportData.subcatVal == 'matm') ? encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.cashout.aeps_matm) : encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.cashout.wallet);

    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => {this.fetchingReport = false;}))
    .subscribe((res: any) => {
      (reportData.subcatVal == 'aeps' || reportData.subcatVal == 'matm') ? this.reportsSource = this.reports = res.BQReport : this.reportsSource = this.reports = res.results.BQReport;
      if(this.reports.length) {
        this.tableCols = Object.keys(this.reports[0]).map((col) => {
          switch(col) {
            case 'Id':
              return { prop: col };

            case 'status':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

            case 'createdDate':
            case 'updatedDate':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };

            default:
              return { name: col.replace(/([A-Z])/g, ' $1') };
          }
        });
        this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
      }
    },
    (err: any) => {
      console.log('Error: ', err);
      this.reportsSource = this.reports = [];
    })
  };

  async fetchCommissionReport(reportData: any) {
    let encURL = '';
    reportData.hasOwnProperty('fromDate') ? encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.commission.comm1) : encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.commission.comm2);
    
    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => {this.fetchingReport = false;}))
    .subscribe((res: any) => {
      this.reportsSource = this.reports = res.BQReport;
      if(this.reports.length) {
        this.tableCols = Object.keys(this.reports[0]).map((col) => {
          switch(col) {
            case 'Id':
              return { prop: col };

            case 'status':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

            case 'createdDate':
            case 'updatedDate':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };

            default:
              return { name: col.replace(/([A-Z])/g, ' $1') };
          }
        });
        this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
      } else {
        vex.dialog.alert('No Records Found!!');
      }
    },
    (err: any) => {
      console.log('Error: ', err);
      this.reportsSource = this.reports = [];
      vex.dialog.alert('Some error occured, while fetching records. Please, try again.');
    })
  };

  async fetchWalletReport(reportData: any, wType: string = undefined) {

    
    let encURL = '';
    if ((wType == 'my_wallet1') || (wType == 'user_wallet1')) {
      encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.wallet.my_wallet1);
    } else if (wType == 'my_wallet2') {
      encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.wallet.my_wallet2);
    // } else if (wType == 'user_wallet1') {
    //   encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.wallet.my_wallet1);
    } else {
      encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.wallet.wallet_intrchng);
    }

    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => {this.fetchingReport = false;}))
    .subscribe((res: any) => {
      this.reportsSource = this.reports = ((wType == 'my_wallet1') || (wType == 'user_wallet1')) ? res.Report : res.BQReport;
      // this.reportsSource = this.reports = (wType == 'my_wallet1') ? res.Report : res.BQReport;
      if(this.reports.length) {
        this.tableCols = Object.keys(this.reports[0]).map((col) => {
          switch(col) {
            case 'Id':
            case 'Type':
              return { prop: col };

            case 'status':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

            case 'createdDate':
            case 'updatedDate':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };

            default:
              return { name: col.replace(/([A-Z])/g, ' $1') };
          }
        });
        this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
      } else {
        vex.dialog.alert('No Records Found!!');
      }
    },
    (err: any) => {
      console.log('Error: ', err);
      this.reportsSource = this.reports = [];
      vex.dialog.alert('Some error occured, while fetching records. Please, try again.');
    })
  };

  async fetchUpiReport(reportData: any) {
    const encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.upi);
    this.reportService.transactionAPI(encURL, reportData)
    .pipe(finalize(() => {this.fetchingReport = false;}))
    .subscribe((res: any) => {
      this.reportsSource = this.reports = res.results.BQReport;
      if(this.reports.length) {
        this.tableCols = Object.keys(this.reports[0]).map((col) => {
          switch(col) {
            case 'Id':
              return { prop: col };

            case 'status':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

            case 'createdDate':
            case 'updatedDate':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };

            default:
              return { name: col.replace(/([A-Z])/g, ' $1') };
          }
        });
        this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
      }
    },
    (err: any) => {
      console.log('Error: ', err);
      this.reportsSource = this.reports = [];
    })
  };

  async fetchAadharReport(reportData: any) {
    console.log(reportData, "khwaja works...");
    console.log(reportData.reportData.status, " status khwaja works...");
    let reqBody = {
      "operationPerformed": reportData.reportData.operationPerformed,
			"start_date": reportData.reportData.start_date,
			"end_date": reportData.reportData.end_date,
			"status": reportData.reportData.status,
			"transaction_type": reportData.reportData.transaction_type,
			"userName": reportData.reportData.userName,
    }
    
    const encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.aadhar);
    this.reportService.transactionAPI(encURL, reqBody)
    .pipe(finalize(() => {this.fetchingReport = false;}))
    .subscribe((res: any) => {
      this.reportsSource = this.reports = res.results.BQReport;
      if(this.reports.length) {
        this.tableCols = Object.keys(this.reports[0]).map((col) => {
          switch(col) {
            case 'Id':
              return { prop: col };

            case 'status':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

            case 'createdDate':
            case 'updatedDate':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };

            default:
              return { name: col.replace(/([A-Z])/g, ' $1') };
          }
        });
        this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
      }
      else{
        vex.dialog.alert("No Data Found...");
      }
    },
    (err: any) => {
      console.log('Error: ', err);
      this.reportsSource = this.reports = [];
      vex.dialog.alert("Something Went Wrong...");
    })
  };

  async fetchunifiedReport(reportData: any) {
    let reqBody = {
      "operationPerformed": reportData.reportData.operationPerformed,
			"start_date": reportData.reportData.start_date,
			"end_date": reportData.reportData.end_date,
			"status": reportData.reportData.status,
			"transaction_type": reportData.reportData.transaction_type,
			"userName": reportData.reportData.userName,
    }
    // console.log(reportData, "it works....");
    
    const encURL = await AuthConfig.config.encodeUrl(ReportsApi.url.unified);
    this.reportService.transactionAPI(encURL, reqBody)
    .pipe(finalize(() => {this.fetchingReport = false;}))
    .subscribe((res: any) => {
      this.reportsSource = this.reports = res.results.BQReport;
      if(this.reports.length) {
        this.tableCols = Object.keys(this.reports[0]).map((col) => {
          switch(col) {
            case 'Id':
              return { prop: col };

            case 'status':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.checkTemplate };

            case 'createdDate':
            case 'updatedDate':
              return { name: col.replace(/([A-Z])/g, ' $1'), cellTemplate: this.dateTemplate };

            default:
              return { name: col.replace(/([A-Z])/g, ' $1') };
          }
        });
        this.tableCols.push({ name: 'Actions', cellTemplate: this.actionTemplate });
      }
    },
    (err: any) => {
      console.log('Error: ', err);
      this.reportsSource = this.reports = [];
    })
  };

  updateFilter(event) {
    // console.log('update filter data: ', event.target.value);
    // const val = event.target.value.toLowerCase();
    const val = event.target.value;
    if (this.reportsSource.length) {
      // filter our data
      if (val && this.reportsSource.length) {
        // const temp = this.reportsSource.filter(function (d) {
        const temp = this.reportsSource.filter(d => {
          // console.log('d: ', d);

          // const vals = Object.values(d).map((s: any) => (typeof s === 'number') ? `${s}` : (s ? s.toLowerCase() : s));
          // console.log('Vals: ', vals);
          // return vals.includes(val);

          const vals = Object.values(d);
          // console.log('Vals: ', vals);
          // console.log('Includes: ', vals.includes(val));
          return vals.includes(val);

          // const vals = Object.values(d).toString();
          // console.log('Vals: ', vals);
          // console.log('Includes: ', vals.includes(val));
          // return vals.includes(val);

          // return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        // update the rows
        this.reports = temp;
      } else {
        // this.reportsSource[0] = {...this.reportsSource[0], Id: `${this.reportsSource[0].Id}`};
        this.reports = this.reportsSource;
      }  
    } else {
      vex.dialog.alert('No data to perform search.');
      this.searchInput.reset();
    }
    


    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  downloadExcel() {
    if (this.reports.length) {
      console.log('Table Cols: ', this.tableCols);
      console.log('Table selCols: ', this.selCols);
      this.reportService.generateExcel([...this.reports], [...this.tableCols]);
    } else {
      vex.dialog.alert('Failed to generate excel sheet.');
    }
  }

  async actionData(txn: any) {
    console.log('Txn: ', txn);

    // console.log('RRN in Trans Report: ', txn.gateWayData.map(data => { return { rrn: data.rrn, amount: data.amount }; }));
    const RRN = (typeof txn.gateWayData === 'object') ? txn.gateWayData.map(data => { return { rrn: data.rrn, amount: data.amount }; }) : 'N/A';

    this.ngxSpinner.show('reportSpinner', { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    this.reportService.fetchuserAPI(ReportsApi.url.shopName2)
    .pipe(finalize(() => {
        let docDefinition = {
          pageSize: 'A4',
          pageMargins:[ 0, 0, 0, 0 ],
        content: [
            {
            style: 'tableExample',
                fillColor: '#f5f9f9',
            table: {
              widths: [595],
            body: [
                  [
                      [
                          {
                                style: 'tableExample',
                                margin: [40, 50, 50, 20],
                                table: {
                                    widths: [250, 250],
                                  body: [
                                      [
                                          {
                                              text: 'iServeU',
                                              style: 'tableHeader',
                                              margin: [0, 0, 0, 25]
                                          },
                                          {
                                              text: this.datePipe.transform(txn.createdDate, 'medium'),
                                              alignment: 'right',
                                              margin: [0, 0, 0, 25]
                                          }
                                      ],
                                      [
                                          {
                                              table: {
                                                  widths: [200],
                                                  body: [
                                                    [
                                                        {
                                                            text: 'From',
                                                              color: '#888888',
                                                              margin: [0, 0, 0, 5],
                                                              border: [false, false, false, true]
                                                        }
                                                    ]
                                                    ]
                                                },
                                                margin: [0, 0, 0, 10],
                                                layout: {
                                                  hLineWidth: function (i, node) {
                                                    return (i === 0 || i === node.table.body.length) ? 1 : '';
                                                  },
                                                  hLineColor: function (i, node) {
                                                    return '#888888';
                                                  },
                                                  hLineStyle: function (i, node) {
                                                    return {dash: {length: 3, space: 3}};
                                                  },
                                                  paddingLeft: function(i, node) { return 0; }
                                                }
                                          },
                                          {
                                                table: {
                                                  widths: [200],
                                                  body: [
                                                    [
                                                        {
                                                            text: 'To',
                                                              color: '#888888',
                                                              margin: [0, 0, 0, 5],
                                                              border: [false, false, false, true]
                                                        }
                                                    ]
                                                    ]
                                                },
                                                margin: [0, 0, 0, 10],
                                                layout: {
                                                  hLineWidth: function (i, node) {
                                                    return (i === 0 || i === node.table.body.length) ? 1 : '';
                                                  },
                                                  hLineColor: function (i, node) {
                                                    return '#888888';
                                                  },
                                                  hLineStyle: function (i, node) {
                                                    return {dash: {length: 3, space: 3}};
                                                  },
                                                  paddingLeft: function(i, node) { return 0; }
                                                }
                                          }
                                      ],
                                      [
                                          {
                                              text: txn.customerName,
                                              bold: true,
                                              margin: [0, 0, 0, 4]
                                          },
                                          {
                                              text: txn.beneName,
                                              bold: true,
                                              margin: [0, 0, 0, 4]
                                          }
                                      ],
                                      [
                                          {
                                              text: 'Mob No.: '+ txn.customerMobileNumber,
                                              color: '#555555'
                                          },
                                          {
                                              text: 'A/C No.: '+ txn.beneAccountNumber,
                                              color: '#555555'
                                          }
                                      ],
                                      [
                                          {
                                              text: ''
                                          },
                                          {
                                              text: 'Bank Name: ' + txn.beneBankName,
                                              color: '#555555'
                                          }
                                      ],
                                      [
                                        {
                                            text: ''
                                        },
                                        {
                                            text: 'IFSC: ' + txn.bene_ifsc ? txn.bene_ifsc : '',
                                            color: '#555555'
                                        }
                                    ],
                                  ],
                                },
                                layout: 'noBorders'
                              }
                      ]
                      
                  ]
              ],
            },
            layout: 'noBorders'
          },
          {
            style: 'tableExample',
                  margin: [40, 40, 0, 0],
            table: {
                widths: [510],
              body: [
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Transaction ID', txn.Id]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ],
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Transaction Mode', txn.transactionMode]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ],
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Amount', this.currencyPipe.transform(txn.amountTransacted, 'INR')]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ],
                [
                  {
                      table: {
                              widths: [250, 250],
                              body: [
                                  ['RRN', 
                                    (RRN === 'N/A') ?	'N/A' : 
                                    {
                                      table: {
                                          widths: ['*', '*'],
                                          body: [
                                              ['RRN', 'Amount'], 
                                              ...RRN.map(data => { const values = Object.values(data); return [(values[0] ? values[0] : 'N/A'), this.currencyPipe.transform(values[1], 'INR')]; })
                                          ]
                                      },
                                    }
                                  ]
                              ]
                          },
                          layout: 'noBorders'
                  }
              ],
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Status', txn.status]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ],
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Shop Name', txn.shop_name]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ]
              ]
            },
                  layout: {
              paddingLeft: function(i, node) { return 15; }
                }
          }
        ],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 16,
            color: '#0e989a'
          }
        }
      }
        
        pdfMake.createPdf(docDefinition).open(); 
        
        this.ngxSpinner.hide('reportSpinner');
    }))
    .subscribe(
      (res: any) => {
        console.log('Shop Name URL Response: ', res);
        txn.shop_name = res.shopName;
      },
      (err: any) => {
        console.log('Shop Name URL Error: ', err);
      }
    );

  }

  showCols(option: any) {
    console.log('Option Selected: ', option);
    if (option.includes('all') || (option.length === 0)) {
      this.tableCols = this.selCols;
    } else {
      this.tableCols = this.selCols.filter(col => option.includes(col.prop));
    }
  }

  transDetail(txnDetail: any) {
    console.log('Trans Detail: ', txnDetail);
    const { Id, createdDate } = txnDetail;
    console.log('Txn ID: ', Id);
    console.log('Txn Date: ', createdDate);
    console.log('Txn Date Piped: ', this.datePipe.transform(createdDate, 'yyyy-MM-dd'));
    const user: {sub: string} = jwt_decode(sessionStorage.getItem('CORE_SESSION'));

    const date = this.datePipe.transform(createdDate, 'yyyy-MM-dd');
    const reportData = {
      "$1": "new_dmt_report_setting",
      "$2": user.sub,
      "$4": date,
      "$5": date,
      "$8": Id
    };

    this.ngxSpinner.show("reportSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    this.reportService.transactionAPI(ReportsApi.url.dmt2.trans_detail, reportData)
    .pipe(finalize(() => { this.ngxSpinner.hide("reportSpinner"); }))
    .subscribe(
      (res: any) => {
        console.log('Txn Report Response: ', res);
        console.log('Txn Reports: ', res.Report);
        if (res.Report.length) {
          this.txnDetailReport.reports = res.Report;
        }
        this.txnDetailsModal.show();
      },
      (err: any) => {
        console.log('Txn Report Error: ', err);
      }
    );
  }

  showRetries(transDetail: any) {
    console.log('Transaction Details: ', transDetail);
    this.retryDataDMT2.transData = transDetail;

    this.retryModal.show();

  }

  // MODAL SHOW CODE
  showTransModal(status = 'SUCCESS') {
    console.log('Trans Status: ', this.socketData.status);
    this.socketData.status = status;
    this.transModal.show();
  }

  connectThenRetry(txnID: number) {

    if (txnID) {
      this.retryDataDMT2.retrying = true;
      // Assign the retry trans ID, so that it can be accessible to retryTrans()
      this.retryDataDMT2.retryTxnID = txnID;
      // this.retryDataDMT2.retryTxnID = 828028636028944;
  
      this.connectSocket();
    }

  }

  retryTrans(txnID: number) {
    console.log('Retry ID: ', txnID);

    // this.connectSocket();

    this.reportService.transRetryAPI(txnID)
    .subscribe(
      (res: any) => {
        console.log('Manual Retry Response: ', res);

      },
      (err: any) => {
        console.log('Manual Retry Error: ', err);
        this.transferErr = true;
        this.retryDataDMT2.retrying = false;
        if (this.socketService2.isConnected) { this.socketService2.disconnectSocket(); }
        vex.dialog.alert(err.error.statusDesc);
      }
    );
  }

  reloadRetryTable() {
    this.fetchingReport =true;
    this.retryModal.hide();
    this.fetchDmt2Report(this.retryDataDMT2.reportData);
  }

  // Check Type in case of Gateway Data changes in report
  // As the data will be in String or Array
  checkType(val: any) {
    return typeof val;
  }

  showGatewayData(txnData: any) {
    console.log('Txn Data for Gateway: ', txnData);
    this.transRecord = txnData;
    this.gatewayModal.show();
  }

  ngOnDestroy() {
    this.unsub.next(true);
    this.unsub.complete();

    this.socketService2.disconnectSocket();
  }

}
