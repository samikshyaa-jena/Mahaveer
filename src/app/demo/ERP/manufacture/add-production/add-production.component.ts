import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../erp-service.service';
import { erp_all_api } from '../../erpAllApi';
import * as Notiflix from 'notiflix';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-production',
  templateUrl: './add-production.component.html',
  styleUrls: ['./add-production.component.scss']
})
export class AddProductionComponent implements OnInit {

  addProductForm: FormGroup;
  show_prod: boolean = false;
  loader: boolean;
  getProductData: any = [];
  productCategory: any = [];
  prodData_id: any = [];
  product_filterData: any = [];
  qty_error: any;
  today = new Date();

  constructor(
    private ErpService: ErpServiceService,
    private datePipe: DatePipe,
  ) {
    this.addProductForm = new FormGroup({
      prod_name: new FormControl("", [Validators.required]),
      target_time: new FormControl("", [Validators.required]),
      qty: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.get_Catagory();
    this.get_proddata();
    this.get_Product();
  }
  get_Product() {
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_product, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        let prodData = res.data;

        for (let i = 0; i < prodData.length; i++) {
          if (prodData[i].delete_stat == 0) {
            this.getProductData.push(prodData[i]);
          }
          for (let j = 0; j < this.productCategory.length; j++) {
            if (this.getProductData[i].prod_id == this.productCategory[j].prod_id) {
              console.log(this.getProductData[i].prod_id);

              this.getProductData[i] = Object.assign(this.getProductData[i],
                { prod_name: this.productCategory[j].prod_name }
              );
            }
          }
        }

        console.log(this.getProductData);

      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });
  }
  get_Catagory = () => {
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.getProduct, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0) {
            this.productCategory.push(catData[i]);
            this.prodData_id.push(catData[i].prod_id);
          }
        }
        console.log(this.productCategory);
      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };
  get_proddata = () => {
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_prod, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0 && !(this.prodData_id.includes(catData[i].prod_id))) {
            this.productCategory.push(catData[i]);
          }
        }
        console.log(this.productCategory);
      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };
  add_Product = () => {
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    const req_body = {
      "prod_id": this.addProductForm.value.prod_name,
      "targetTime": this.datePipe.transform(this.addProductForm.value.target_time, 'dd-MM-yyyy'),
      "qty": this.addProductForm.value.qty

    }

    this.ErpService.post_Reqs(erp_all_api.urls.add_product, req_body, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success(res, '', 'Close');
        this.cancel();
      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };

  showAddProduct() {
    this.show_prod = true;
  }

  prevent_0(e: any) {
    console.log(e);    

    if (this.addProductForm.value.qty < 1 && this.addProductForm.value.qty != '') {
      this.qty_error = 'Quantity should be greater than 0';
    } else {
      this.qty_error = null;
    }
  }
  cancel(){
    this.show_prod = false;
    this.addProductForm.reset();
  }
  prevent_char(e: any) {
    console.log(e);   

      return e.keyCode >= 48 && e.charCode <= 57;
  }

}
