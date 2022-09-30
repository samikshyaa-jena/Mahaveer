import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../erp-service.service';
import { erp_all_api } from '../../erpAllApi';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  loader: boolean;
  showAddVendor: boolean;
  addVendorForm: FormGroup;
  updateVendorForm: FormGroup;
  getVendorData: any = [];
  addVendorData: any;
  vendIndex: any;
  changed: boolean = true;

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) { 
    this.addVendorForm = new FormGroup({
      ven_name: new FormControl("",[Validators.required]),
      id: new FormControl(""),
      ven_email: new FormControl("",[Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
      mob: new FormControl("",[Validators.required, Validators.minLength(10)]),
      type: new FormControl('Select Type',[Validators.required]),
      gst_in: new FormControl("",[Validators.required, Validators.pattern(/^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz]{1}[0-9A-Za-z]{1}?$/)]),
      add: new FormControl("",[Validators.required, Validators.minLength(10)]),
    });
    this.updateVendorForm = new FormGroup({
      ven_name: new FormControl("",[Validators.required]),
      id: new FormControl(""),
      ven_email: new FormControl("",[Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
      mob: new FormControl("",[Validators.required, Validators.minLength(10)]),
      type: new FormControl("",[Validators.required]),
      gst_in: new FormControl("",[Validators.required, Validators.pattern(/^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz]{1}[0-9A-Za-z]{1}?$/)]),
      add: new FormControl("",[Validators.required, Validators.minLength(10)]),
    });
   }

   ngOnInit(): void {
    this.get_Vendor();
  }

  show_AddVendor() {
    this.showAddVendor = true;
    this.addVendorForm.patchValue({type: 'Vendor'});
  }
  hide_AddVendor() {
    this.showAddVendor = false;
    this.addVendorForm.reset();
  }

  get_Vendor = () =>{
    this.getVendorData = [];
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_cust).pipe(finalize(() => {this.loader = false;})).subscribe(
      (res: any) =>{
        let vendorData = res.data;
        for (let i = 0; i < vendorData.length; i++) {
          if (vendorData[i].delete_stat == 0) {
            this.getVendorData.push(vendorData[i]);
          }
        }
        console.log(this.getVendorData);
        
      },
      (err: any) =>{
        console.log(err);
          Notiflix.Report.failure(err.error.msg, '', 'Close');(err.msg);
      });

  };

  add_Vendor = () =>{
    this.loader = true;
    const reqBody = {
    name: this.addVendorForm.get('ven_name').value,
    id: this.addVendorForm.get('id').value,
    email: this.addVendorForm.get('ven_email').value,
    gstn: this.addVendorForm.get('gst_in').value,
    mobile: this.addVendorForm.get('mob').value,
    type: this.addVendorForm.get('type').value,
    address: this.addVendorForm.get('add').value,
    };

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.add_cust, reqBody).pipe(finalize(() => {this.loader = false;})).subscribe(
      (res: any) =>{
        this.getVendorData = [];
        this.get_Vendor();
        this.hide_AddVendor();
        this.addVendorData = res.data;
        console.log(this.addVendorData);
        this.addVendorForm.reset();
        Notiflix.Report.success(res.message, '', 'Close');;
      },
      (err: any) =>{
        console.log(err);
          Notiflix.Report.failure(err.error.msg, '', 'Close');(err.error.msg);        
      });

  };
  // update vendor popup open
  update_vend_popup_open(content,i) {
    console.log(this.getVendorData[i].name);
    
    this.vendIndex = i;    
    this.updateVendorForm.patchValue({
      ven_name: this.getVendorData[i].name,
      id: this.getVendorData[i].id,
      ven_email: this.getVendorData[i].email,
      gst_in: this.getVendorData[i].gstn,
      mob: this.getVendorData[i].mobile,
      type: this.getVendorData[i].type,
      add: this.getVendorData[i].address,
    });
    this.modalService.open(content);
    console.log(this.vendIndex);
  }
  // update vendor popup close
  update_vend_popup_close(content) {
    this.modalService.dismissAll(content);
  }

  update_vendor = () =>{
    this.loader = true;

    const reqBody = {

    name: this.updateVendorForm.get('ven_name').value,
    email: this.updateVendorForm.get('ven_email').value,
    gstn: this.updateVendorForm.get('gst_in').value,
    mobile: this.updateVendorForm.get('mob').value,
    type: this.updateVendorForm.get('type').value,
    address: this.updateVendorForm.get('add').value,
    id: this.updateVendorForm.get('id').value,
    customer_id: this.getVendorData[this.vendIndex].customer_id,
    };

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.update_cust, reqBody).pipe(finalize(() => {this.loader = false;})).subscribe(
      (res: any) =>{
        this.get_Vendor();
        Notiflix.Report.success(res.msg, '', 'Close');;
        this.update_vend_popup_close('content');
        
      },
      (err: any) =>{
        console.log(err);        
          Notiflix.Report.failure(err.error.msg, '', 'Close');(err.msg);
      });
  }

  delete_vendor = (i) =>{
    this.loader = true;
    const reqBody = {
      customer_id: this.getVendorData[i].customer_id,
    };

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.delete_cust, reqBody).pipe(finalize(() => {this.loader = false;})).subscribe(
      (res: any) =>{
        this.getVendorData = [];
        this.get_Vendor();
        Notiflix.Report.success(res.msg, '', 'Close');;
      },
      (err: any) =>{
        console.log(err); 
          Notiflix.Report.failure(err.error.msg, '', 'Close');(err.msg);       
      });
  }
}