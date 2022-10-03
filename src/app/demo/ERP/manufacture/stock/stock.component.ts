import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../erp-service.service';
import { erp_all_api } from '../../erpAllApi';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  stockData: any;
  stockPopupData: any[];
  stk_modal: boolean;
  loader: boolean;
  modeForm: any;
  stockInData: any[];
  stockOutData: any[];
  stockBasicData: any;
  stk_in: boolean = true;

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.modeForm = new FormGroup({
      mode: new FormControl("Choose Type")
    });
  }

  ngOnInit(): void {
    this.get_rawMatData();
  }

  changeType = (e) => {
    console.log(e);
    if (e == 'trade') {
      this.router.navigate(["/v2/Erpmain/trade/stock"])
    }
  }


  // popup open
  open(content) {
    this.modalService.open(content);
  }
  // popup close
  close(content) {
    this.modalService.dismissAll(content);
  }
  get_rawMatData() {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.stock).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        // console.log("response is", res);
        // for (const iterator of res.data) {
        this.stockData = res.data.filter((el, i) => { return el.c == "manufacture" })
        // }
        // this.stockData = res.data;
        // console.log("hshs=>", this.stockData);        
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  }
  stockTablePopup = (data, content) => {
    // this.modalService.open(content);
    this.stockInData = data.ItemHistory;
    this.stockBasicData = data;
    this.stockOutData = data.out_history

    // console.log("stok==>", this.stockBasicData);

  }

  changeStockType = (change: boolean) => {
    console.log("change-->", change);

    this.stk_in = change
  }


}
