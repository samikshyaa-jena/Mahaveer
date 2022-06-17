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
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  loader: boolean;
  showAddVendor: boolean;
  addVendorForm: FormGroup;
  updateVendorForm: FormGroup;
  getVendorData: any = [];
  addVendorData: any;
  vendIndex: any;
  modeForm: FormGroup;

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) { 
    this.addVendorForm = new FormGroup({
      ven_name: new FormControl("",[Validators.required, Validators.minLength(10)]),
      ven_email: new FormControl("",[Validators.required, Validators.minLength(10)]),
      mob: new FormControl("",[Validators.required, Validators.minLength(10)]),
      type: new FormControl("",[Validators.required]),
      gst_in: new FormControl("",[Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]),
      add: new FormControl("",[Validators.required, Validators.minLength(10)]),
    });
    this.updateVendorForm = new FormGroup({
      ven_name: new FormControl("",[Validators.required, Validators.minLength(10)]),
      ven_email: new FormControl("",[Validators.required, Validators.minLength(10)]),
      mob: new FormControl("",[Validators.required, Validators.minLength(10)]),
      type: new FormControl("",[Validators.required]),
      gst_in: new FormControl("",[Validators.required, Validators.minLength(10)]),
      add: new FormControl("",[Validators.required, Validators.minLength(10)]),
    });
    this.modeForm = new FormGroup({
      mode: new FormControl("Choose Type")
    });
   }

   ngOnInit(): void {
    this.get_Vendor();
  }

  changeType = (e)=>{
    console.log(e);
    if (e == 'manufcture') {
      this.router.navigate(["/v2/Erpmain/vendor"])
    }
  }

  show_AddVendor() {
    this.showAddVendor = true;
    this.addVendorForm.patchValue({type: 'Vendor'});
  }
  hide_AddVendor() {
    this.showAddVendor = false;
  }

  get_Vendor = () =>{
    this.getVendorData = [];
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_trd_vendor, { headers: headers }).pipe(finalize(() => {this.loader = false;})).subscribe(
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
    email: this.addVendorForm.get('ven_email').value,
    gstn: this.addVendorForm.get('gst_in').value,
    phone: this.addVendorForm.get('mob').value,
    type: this.addVendorForm.get('type').value,
    address: this.addVendorForm.get('add').value
    };

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.add_trd_vendor, reqBody, { headers: headers }).pipe(finalize(() => {this.loader = false;})).subscribe(
      (res: any) =>{
        this.getVendorData = [];
        this.get_Vendor();
        this.hide_AddVendor();
        this.addVendorData = res.data;
        console.log(this.addVendorData);
        this.addVendorForm.reset();
        Notiflix.Report.success(res.msg, '', 'Close');;
      },
      (err: any) =>{
        console.log(err);
          Notiflix.Report.failure(err.error.msg, '', 'Close');(err.error.msg);
      });

  };
  // update vendor popup open
  update_vend_popup_open(content,i) {
    console.log(this.getVendorData[i].name);
    console.log(this.getVendorData[i]);

    this.vendIndex = i;
    this.updateVendorForm.patchValue({
      ven_name: this.getVendorData[i].name,
      ven_email: this.getVendorData[i].email,
      gst_in: this.getVendorData[i].gstn,
      mob: this.getVendorData[i].phone,
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
    phone: this.updateVendorForm.get('mob').value,
    type: this.updateVendorForm.get('type').value,
    address: this.updateVendorForm.get('add').value,
    vendor_id: this.getVendorData[this.vendIndex].vendor_id,
    };

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.update_trd_vendor, reqBody, { headers: headers }).pipe(finalize(() => {this.loader = false;})).subscribe(
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
    vendor_id: this.getVendorData[i].vendor_id,
    };

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.delete_trd_vendor, reqBody, { headers: headers }).pipe(finalize(() => {this.loader = false;})).subscribe(
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
