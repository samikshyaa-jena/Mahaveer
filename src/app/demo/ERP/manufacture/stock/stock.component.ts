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

  changeType = (e)=>{
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
  get_rawMatData(){
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.get_rawMatData).pipe(finalize(() => {this.loader = false;})).subscribe(
      (res: any) =>{
        console.log("response is",res);
        this.stockData = res.data;
      },
      (err: any) =>{
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  }
  stockTablePopup = (data, content)=>{
    console.log(data);
    this.modalService.open(content);
    this.stockPopupData = data;
  }

}
