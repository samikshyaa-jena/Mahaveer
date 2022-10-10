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
  constructor(private ErpService: ErpServiceService,) { }

  ngOnInit() {
    this.getScrap();
  }

  getScrap = () => {
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.get_scrap).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);
        for (const scarpList of res.data) {
          let qty = 0; 
          for (const iterator of scarpList.scrap_data) {

            qty = qty + iterator.quantity                       
            
          }
          let scrap = {
            type: scarpList["type"],
            total_qty:qty
          }
          this.getscrapData.push(scrap)
          
        }
        

        
      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };

}
