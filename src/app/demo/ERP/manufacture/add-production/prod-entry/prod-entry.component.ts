import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as Notiflix from 'notiflix';
import { ErpServiceService } from '../../../erp-service.service';
import { erp_all_api } from '../../../erpAllApi';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-prod-entry',
  templateUrl: './prod-entry.component.html',
  styleUrls: ['./prod-entry.component.scss']
})
export class ProdEntryComponent implements OnInit {

  @Output() BackTab = new EventEmitter<boolean>()

  productCategory: any = [];
  materialsData: any = [];
  prodData_id: any = [];
  loader: boolean;
  qty_error: any;
  addProductForm: FormGroup;
  total: number = 0;
  yr= new Date().getFullYear()
  mon= new Date().getMonth()
  dt= new Date().getDate()
  today = new Date(this.yr, this.mon, this.dt);
  
  

  constructor(
    private fb: FormBuilder,
    private ErpService: ErpServiceService,
    private datePipe: DatePipe,
  ) { 
    this.addProductForm = new FormGroup({
      prod_name: new FormControl("choose_prod", [Validators.required]),
      target_time: new FormControl("", [Validators.required]),
      qty: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {

    // console.log(this.edit);
    // console.log(this.rawmatData);
    

    this.get_Category();

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
  // get_proddata = () => {
  //   this.loader = true;
  //   let auth_token = sessionStorage.getItem('CORE_SESSION');
  //   let headers = new HttpHeaders();
  //   headers = headers.set('auth-token', auth_token);

  //   this.ErpService.get_Reqs(erp_all_api.urls.get_prod).pipe(finalize(() => { this.loader = false; })).subscribe(
  //     (res: any) => {
  //       let catData = res.data;
  //       for (let i = 0; i < catData.length; i++) {
  //         if (catData[i].delete_stat == 0 && !(this.prodData_id.includes(catData[i].prod_id))) {
  //           this.productCategory.push(catData[i]);
  //         }
  //       }
  //       console.log(this.productCategory);
  //     },
  //     (err: any) => {
  //       Notiflix.Report.failure(err.error.msg, '', 'Close');

  //     });

  // };

  showRawmat(val){
    this.materialsData = [];
    for (let i = 0; i < this.productCategory.length; i++) {
      if (this.productCategory[i].prod_id == val) {
        for (let j = 0; j < this.productCategory[i].materials_data.length; j++) {
          this.materialsData.push(this.productCategory[i].materials_data[j]);
          this.total += this.materialsData[j].mrp; 
        }
      }
    }

    if (this.addProductForm.value.qty) {
      for (let i = 0; i < this.materialsData.length; i++) {
        this.materialsData[i] = Object.assign(this.materialsData[i],
          { qty: this.materialsData[i].quantity * this.addProductForm.value.qty }
        );
        // this.materialsData[i].quantity = this.materialsData[i].quantity * this.addProductForm.value.qty;   
        
      }      
    }
    console.log(this.materialsData);
    
  }

  totalCalculation(){
    if (this.materialsData) {
      for (let i = 0; i < this.materialsData.length; i++) {
        this.materialsData[i] = Object.assign(this.materialsData[i],
          { qty: this.materialsData[i].quantity * this.addProductForm.value.qty }
        );
        // this.materialsData[i].quantity = this.materialsData[i].quantity * this.addProductForm.value.qty;   
        
      }      
    }
  }

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
        Notiflix.Report.success(res.msg, '', 'Close');
        this.previousPage();
      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };
  
  prevent_0(e: any) {
    console.log(e);    

    if (this.addProductForm.value.qty < 1 && this.addProductForm.value.qty != '') {
      this.qty_error = 'Quantity should be greater than 0';
    } else {
      this.qty_error = null;
    }
  }
  prevent_char(e: any) {
      return e.keyCode >= 48 && e.charCode <= 57;
  }

  previousPage() {
    this.BackTab.emit();
  }

}

