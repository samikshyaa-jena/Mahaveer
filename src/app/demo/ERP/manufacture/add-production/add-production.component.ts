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
  editProductForm: FormGroup;
  show_prod: boolean = false;
  edit_prod: boolean = false;
  loader: boolean;
  getProductData: any = [];
  productCategory: any = [];
  prodData_id: any = [];
  product_filterData: any = [];
  qty_error: any;
  today = new Date();
  date2 = new Date();
  scrap: boolean;
  getscrapData: any;
  showAutcompleteList: boolean;
  getscrapData2: any;
  edit: boolean;
  rawmatData: any;
  scrap_con: boolean;

  constructor(
    private ErpService: ErpServiceService,
    private datePipe: DatePipe,
  ) {
    this.addProductForm = new FormGroup({
      prod_name: new FormControl("", [Validators.required]),
      target_time: new FormControl("", [Validators.required]),
      qty: new FormControl("", [Validators.required]),
    });
    this.editProductForm = new FormGroup({
      prod_id: new FormControl("", [Validators.required]),
      status: new FormControl("progress", [Validators.required]),
      target_time: new FormControl("", [Validators.required]),
      scrap: new FormControl(""),
      qty: new FormControl(""),
      unit: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.get_Category();
    // this.get_proddata();
    this.get_Product();
  }
  get_Product() {
    this.loader = true;
    this.getProductData = [];
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_product).pipe(finalize(() => {this.loader = false;})).subscribe(
      (res: any) =>{
        console.log(res);
        let prod = res.data;
        for (let i = 0; i < prod.length; i++) {
          if (prod[i].delete_stat == 0 ) {
            this.getProductData.push(prod[i]);
          }
          // for (let j = 0; j < this.productCategory.length; j++) {
          //   if (this.getProductData[i].prod_id == this.productCategory[j].prod_id) {
          //     console.log(this.getProductData[i].prod_id);

          //     this.getProductData[i] = Object.assign(this.getProductData[i],
          //       { production_id: this.productCategory[j].prodution_id }
          //     );
          //   }
          // }
        }

        console.log("getProductData==>", this.getProductData);
        

        //   for (let j = 0; j < this.getProductData.length; j++) {
        //     var t;
        //     var tar_t: any;
        //     t = this.getProductData[j].approx_time;

        //     console.log(this.getProductData[j].approx_time.length);
            

        //     if (t.length == 3) {
        //       tar_t = t.charAt(0) + t.charAt(1);              
        //     } else {
        //       tar_t = t.charAt(0);              
        //     }

        //     var n = parseInt(tar_t);

        //     console.log(n);
            
        //     this.date2.setDate(this.today.getDate() + n);

        //     console.log(this.date2);
            

        //     if (this.getProductData[j].approx_time.slice(-1) == 'D') {
        //       this.getProductData[j] = Object.assign(this.getProductData[j],
        //         { tar_date: this.date2.setDate(this.today.getDate() + n) }
        //       );
        //     } else {

        //       this.getProductData[j] = Object.assign(this.getProductData[j],
        //         { tar_date: this.date2.setMonth(this.today.getMonth() + n) }
        //       );

        //     }
            
        //   }

        // console.log(this.getProductData);
        
      },
      (err: any) =>{
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
        
      });

    // this.ErpService.get_Reqs(erp_all_api.urls.get_product).pipe(finalize(() => { this.loader = false; })).subscribe(
    //   (res: any) => {
    //     let prodData = res.data;

    //     for (let i = 0; i < prodData.length; i++) {
    //       if (prodData[i].delete_stat == 0) {
    //         this.getProductData.push(prodData[i]);
    //       }
    //       for (let j = 0; j < this.productCategory.length; j++) {
    //         if (this.getProductData[i].prod_id == this.productCategory[j].prod_id) {
    //           console.log(this.getProductData[i].prod_id);

    //           this.getProductData[i] = Object.assign(this.getProductData[i],
    //             { prod_name: this.productCategory[j].prod_name }
    //           );
    //         }
    //       }
    //     }

    //     console.log(this.getProductData);

    //   },
    //   (err: any) => {
    //     Notiflix.Report.failure(err.error.msg, '', 'Close');

    //   });
  }
  get_Category = () => {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_profuct_req).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0 && catData[i].materials_data.length > 0) {
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
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_prod).pipe(finalize(() => { this.loader = false; })).subscribe(
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
 
  // getScrap = () => {
  //   this.loader = true;
  //   let auth_token = sessionStorage.getItem('CORE_SESSION');
  //   let headers = new HttpHeaders();
  //   headers = headers.set('auth-token', auth_token);

  //   this.ErpService.get_Reqs(erp_all_api.urls.get_scrap).pipe(finalize(() => { this.loader = false; })).subscribe(
  //     (res: any) => {
  //       console.log(res);

  //       this.getscrapData = res.data;
  //       this.getscrapData2 = res.data;
        
  //     },
  //     (err: any) => {
  //       Notiflix.Report.failure(err.error.msg, '', 'Close');

  //     });

  // };
  add_Product = () => {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    const req_body = {
      "prod_id": this.addProductForm.value.prod_name,
      "targetTime": this.datePipe.transform(this.addProductForm.value.target_time, 'MM-dd-yyyy'),
      "qty": parseInt(this.addProductForm.value.qty)

    }

    this.ErpService.post_Reqs(erp_all_api.urls.add_product, req_body).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success(res, '', 'Close');
        this.get_Product();
      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };
  addScrap = () => {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    const req_body = [{
    "type": this.editProductForm.value.scrap,
    "qty": this.editProductForm.value.qty,
    "unit": this.editProductForm.value.unit,
    "entry_date": this.datePipe.transform(this.today, 'yyyy-MM-dd')
    }]

    this.ErpService.post_Reqs(erp_all_api.urls.add_scrap, req_body).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success(res, '', 'Close');
        this.cancelEdittab();
      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };

  showAddProduct() {
    this.show_prod = true;
    this.scrap_con = false;
  }
  editProduct(row) {

    // this.edit_prod = true;
    this.edit = false;
    this.rawmatData = row;
    this.showscrapcons();
    
    // var t_date = new Date(row.tar_date);
    // t_date = this.datePipe.transform(t_date, 'yyyy-MM-dd');
    // console.log(t_date);
    
    // this.editProductForm.patchValue({
    //   target_time: t_date,
    //   prod_id: row.prodution_id,
    // });
    // this.editProductForm.value.target_time.setDate(t_date);

    // this.getScrap();
  }

  chStatus(evt){
    if (evt.target.value == 'completed') {
      this.scrap = true;
      this.editProductForm.patchValue({
        target_time: this.today,
      });      
    }
    else{
      this.scrap = false;
    }
  }

  getScheduledTime(evt){
    console.log(evt);
    
    var d1 = this.datePipe.transform(evt.value, 'yyyy-MM-dd');
    var d2 = this.datePipe.transform(this.today, 'yyyy-MM-dd');

    console.log(d1, d2);
    

    if ( this.editProductForm.value.status == 'completed' &&  d1 > d2) {
      this.editProductForm.patchValue({
        status: 'progress',
      });      
    }
  }

  prevent_0(e: any) {
    console.log(e);    

    if (this.addProductForm.value.qty < 1 && this.addProductForm.value.qty != '') {
      this.qty_error = 'Quantity should be greater than 0';
    } else {
      this.qty_error = null;
    }
  }
  updateProduct(status,row){
    console.log(row);

    this.edit = true;
    this.rawmatData = row;
    
    // this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    const req_body = {
        "prodution_id": row.production_id,
        "expected_time": this.datePipe.transform(row.expected_time, 'dd-MM-yyyy'),
        "status": status
    }

    this.ErpService.post_Reqs(erp_all_api.urls.update_product, req_body).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        // this.get_Product();
        this.show_prod = false;
        this.edit_prod = true;
      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });
  }

  // updateProduct_scrap(){
  //   this.updateProduct();
  //   if (this.editProductForm.value.status == 'completed') {      
  //     this.addScrap();
  //   }
  // }
  showscrapcons(){
    this.scrap_con = true;
    this.show_prod = false;
  }
  cancelEdittab(){
    this.edit_prod = false;
    // this.editProductForm.reset();
  }
  prevent_char(e: any) {
    console.log(e);   

      return e.keyCode >= 48 && e.charCode <= 57;
  }

  // getSc(event){
  //   if (event.target.value != '') {
  //     const val = event.target.value;
  //   this.getscrapData = this.getscrapData2;
  //   var temp = this.getscrapData.filter(d => {
  //     const vals = d.type;
  //     console.log(vals);
      
  //     return new RegExp(val, 'gi').test(vals.toString());
  //   });
  
  //   this.getscrapData = temp;
  //   if (temp && temp != '') {
  //     this.showAutcompleteList = true;
  //   }
  //   else{
  //     this.showAutcompleteList = false;
  //   }
  // }
  // else{
  //   this.showAutcompleteList = false;
  // }
  // }

  // selectScrap(obj) {
  //   console.log(obj);
  //   this.showAutcompleteList = false;
  //   this.editProductForm.controls.scrap.setValue(obj.type);
  // }

  back(e){
    this.scrap_con = e;
    this.show_prod = e;
    this.get_Product();
  }

}
