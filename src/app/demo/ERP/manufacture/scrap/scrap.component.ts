import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../erp-service.service';
import { erp_all_api } from '../../erpAllApi';
import * as Notiflix from 'notiflix';

@Component({
  selector: 'app-scrap',
  templateUrl: './scrap.component.html',
  styleUrls: ['./scrap.component.scss']
})
export class ScrapComponent implements OnInit {
  loader: boolean;
  getscrapData: any = [];
<<<<<<< HEAD
=======
  stockInData: any[];
  stockOutData: any[];
  stk_in: boolean = true;
  stockBasicData: any;
  // scrapQty: [];

>>>>>>> 089393b7ce9a740f500791a223922e1bf55c49a3
  constructor(private ErpService: ErpServiceService,) { }

  ngOnInit() {
    this.getScrap();
  }

  getScrap = () => {
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.get_scrap).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);
<<<<<<< HEAD
        for (const scarpList of res.data) {
          let qty = 0; 
          for (const iterator of scarpList.scrap_data) {
=======

        this.getscrapData = res.data;
        // for (const scarpList of res.data) {
        //   let qty = 0;
        //   for (const iterator of scarpList.scrap_data) {

        //     qty = qty + iterator.quantity

        //   }
        //   let scrap = {
        //     type: scarpList["prod_name"],
        //     total_qty: qty
        //   }
        //   this.getscrapData.push(scrap)

        // }

>>>>>>> 089393b7ce9a740f500791a223922e1bf55c49a3


      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };

  stockTablePopup = (data, content) => {
    // this.modalService.open(content);
    this.stockInData = data.in_data;
    this.stockBasicData = data;
    this.stockOutData = data.out_data

    // console.log("stok==>", this.stockBasicData);

  }

  changeStockType = (change: boolean) => {
    console.log("change-->", change);

    this.stk_in = change
  }


}
