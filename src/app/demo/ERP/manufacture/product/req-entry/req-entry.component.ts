import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../../erp-service.service';
import { erp_all_api } from '../../../erpAllApi';
import * as Notiflix from 'notiflix';

@Component({
  selector: 'app-req-entry',
  templateUrl: './req-entry.component.html',
  styleUrls: ['./req-entry.component.scss']
})
export class ReqEntryComponent implements OnInit {
  getCategoryData: any = [];
  itemData: any = [];
  addmat: FormGroup;
  productformArray: any[]
  openmodal: boolean = false
  total_value: number;
  gstVal: number;
  requirementformarray: any = [];
  loader: boolean;
  getVendorData: any = [];
  productname: any;
  itemname: any;
  item_form: FormGroup;
  duplicateproductformarray: any = [];
  type: any;
  today = new Date();

  @Output() BackTab = new EventEmitter<boolean>()
  @Output() get_purchase_details: EventEmitter<any> = new EventEmitter();
  showInps: boolean = false;

  t_gst: number;
  t_amount: number;
  getProductData: any;
  rawMat: any;
  prodData_id: any = [];

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {

    this.addmat = new FormGroup({
      "product": new FormArray([

      ])
    })

    this.item_form = new FormGroup({
      prod_name: new FormControl("choose_prod", [Validators.required]),
      est_time: new FormControl("1", [Validators.required]),
      // gst: new FormControl("gst", [Validators.required]),
      // stock: new FormControl("", [Validators.required]),
      // unit: new FormControl("unit", [Validators.required]),
      // mrp: new FormControl("", [Validators.required]),
      // hsn: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.get_Category();
    this.get_proddata();
    this.get_Vendor();
    this.getRawmaterials();
    this.add_row();
  }
  get_Category = () => {
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.getProduct, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        // this.getCategoryData = res.data;
        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0) {
            this.getCategoryData.push(catData[i]);
            this.prodData_id.push(catData[i].prod_id);
          }
        }
        console.log(this.getCategoryData);
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
        // this.getCategoryData = res.data;
        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0 && !(this.prodData_id.includes(catData[i].prod_id))) {
            this.getCategoryData.push(catData[i]);
          }
        }
        console.log(this.getCategoryData);
      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };
  get_Vendor = () => {
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);
    this.ErpService.get_Reqs(erp_all_api.urls.get_cust, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(

      (res: any) => {
        let vendorData = res.data;
        for (let i = 0; i < vendorData.length; i++) {
          if (vendorData[i].delete_stat == 0) {
            this.getVendorData.push(vendorData[i]);
          }
        }
        console.log(this.getVendorData);
      },

      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };

  getRawmaterials(){

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_rawmat, { headers: headers }).pipe(finalize(() => {this.loader = false;})).subscribe(
      (res: any) =>{
        console.log(res);
        this.rawMat = res.data;                
      },
      (err: any) =>{
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
        
      });

  }

  vendorType(e) {
    console.log(e);
    this.getVendorData.forEach(x => {
      if (x.vendor_id == e) {
        this.type = x.type;
      }
    })
    console.log(this.type);
  }
  chooseMaterial(form_cont, item) {

    form_cont.patchValue({
      discount: 0,
      qty: 1,
  });

    console.log(item);
    console.log(form_cont);
    console.log(this.item_form);
    console.log(this.getCategoryData);

    if (item != "ChooseProduct") {
      let gst;
      let GST;
      let mrp;

      for (let i = 0; i < this.rawMat.length; i++) {
        if (this.rawMat[i].material_id == item) {
          GST = parseInt(this.rawMat[i].gst);
            mrp = this.rawMat[i].mrp;
            gst = mrp * (GST / 100);

            form_cont.patchValue({
              gst: gst,
              gst_rate: this.rawMat[i].gst,
              hsn: this.rawMat[i].hsn,
              price: mrp,
              unit: this.rawMat[i].unit,
            });
          
        }
      }

    }


    this.calc_total(form_cont.controls);

  }


  calc_total(form_cont) {

    console.log(form_cont);
    

    let prc: number = form_cont.price.value;
    let qt: number = form_cont.qty.value;
    let GST: number = form_cont.gst_rate.value;
   let item = form_cont.item.value;

    let gst: number;

    for (let i = 0; i < this.rawMat.length; i++) {
      if (this.rawMat[i].material_id == item) {

        gst = prc * (GST / 100);
        console.log(GST);
        console.log(this.rawMat[i].gst);
        
        console.log(gst);
        
      }
    }

    console.log(gst);

    let total: number = 0;
    let total_gst: number = 0;

    if (qt) {

      total_gst = parseFloat((gst * qt).toFixed(2));
      total = parseFloat((total_gst + (prc * qt).toFixed(2)));

      form_cont.total.patchValue(total);
      form_cont.gst.patchValue(total_gst);
      console.log(form_cont);
    }

  }

  delete(i) {
    Notiflix.Report.success('Are you want to delete', '', 'Ok');
    this.requirementformarray.splice(i, 1)
  }

  resetProductForm() {
    var p_form = this.addmat.get('product')['controls'];
    console.log(p_form);
    p_form.splice(1, p_form.length);
    p_form[0].reset();
    p_form[0].patchValue({
      category: 'ChooseProduct',
      price: 0,
      qty: 1,
      discount: 0
    });
    console.log(p_form);
    this.totalCalculation()
  }


  add_requirement = () => {

    this.loader = true;

    this.requirementformarray = [];
    var p_form = this.addmat.get('product')['controls'];
    console.log(p_form);

    for (let i = 0; i < p_form.length; i++) {
      console.log(p_form[i].value);
      this.requirementformarray.push(p_form[i].value)
    }

    if (this.requirementformarray) {

      var product_arr = this.requirementformarray.map((p_array) => {
        return {
          mat_id: p_array.item,
          qty: p_array.qty,
        }
      });

    }

    
    console.log(this.requirementformarray);
    const reqBody = {
      "prod_id": this.item_form.get('prod_name').value,
      "targetTime": this.item_form.get('est_time').value + 'D',
      "requirements": product_arr,
    }

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.set_prod_req, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success('SuccessFully Added', '', 'Close');
        console.log(res, "get item");
        this.item_form.reset();
        this.previousPage();
      },
      (err: any) => {
        console.log(err);
        console.log(err.error.msg);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };
  previousPage() {
    this.BackTab.emit();
  }

  matdata(): FormGroup {
    return this.fb.group({

      item: new FormControl('choose_mat', [Validators.required]),
      gst_rate: new FormControl('', [Validators.required]),
      gst: new FormControl('', [Validators.required]),
      hsn: new FormControl(''),
      price: new FormControl('0', [Validators.required]),
      qty: new FormControl('1', [Validators.required]),
      unit: new FormControl('unit', [Validators.required]),
      total: new FormControl('', [Validators.required]),

    })
  }

  add_row() {
    (<FormArray>this.addmat.get('product')).push(this.matdata())
  }
  deleteRow(i) {
    (<FormArray>this.addmat.get('product')).removeAt(i)
  }

  totalCalculation() {

    var pform = this.addmat.get('product')['controls'];

    this.t_gst = 0;
    this.t_amount = 0;

    for (let i = 0; i < pform.length; i++) {
      this.t_gst = this.t_gst + pform[i].value.gst;
      this.t_amount = this.t_amount + pform[i].value.total;
    }

  }

  prevent(e, type) {
    console.log(e.target.value);

    if (type == 'qty') {
      if (e.target.value > 0) {
        return e.keyCode >= 48 && e.charCode <= 57;
      } else {
        return e.keyCode > 48 && e.charCode <= 57;
      }
    }
    else if (type == 'dis') {
      return e.keyCode >= 48 && e.charCode <= 57;
    }
  }

}
