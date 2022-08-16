import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { finalize } from 'rxjs/operators';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErpServiceService } from '../../../erp-service.service';
import { erp_all_api } from '../../../erpAllApi';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss']
})
export class PurchaseAddComponent implements OnInit {

  getCategoryData: any;
  itemData: any;
  productForm: FormGroup;
  productformArray: any[];
  openmodal: boolean = false;
  total_value: number;
  gstVal: number;
  productformarray: any = [];
  loader: boolean;
  getVendorData: any = [];
  productname: any;
  itemname: any;
  purchase_form: FormGroup;
  duplicateproductformarray: any = [];
  type: any;
  @Output() BackTab = new EventEmitter<boolean>()

  @Output() get_purchase_details: EventEmitter<any> = new EventEmitter();

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { 
    this.productForm = new FormGroup({
      category: new FormControl('ChooseCategory', [Validators.required]),
      item_id: new FormControl('ChooseItem', [Validators.required]),
      igst: new FormControl('', [Validators.required]),
      cgst: new FormControl('', [Validators.required]),
      sgst: new FormControl('', [Validators.required]),
      hsn: new FormControl(''),
      price: new FormControl('0', [Validators.required]),
      qty: new FormControl('1', [Validators.required]),
      discount: new FormControl('0', [Validators.required]),
      total: new FormControl('', [Validators.required])
    })
    this.purchase_form = new FormGroup({
      invo: new FormControl("", [Validators.required]),
      vendor: new FormControl("", [Validators.required]),
      p_date: new FormControl("", [Validators.required]),
    });
   }

   ngOnInit(): void {
    this.get_Category()
    this.get_Vendor()
  }
  get_Category = () => {
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.getCategory, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        this.getCategoryData = res.data;
        console.log(this.getCategoryData);
      },
      (err: any) => {
        Notiflix.Report.failure(err.msg, '', 'Close');

      });

  };
  get_Vendor = () => {
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);
    this.ErpService.get_Reqs(erp_all_api.urls.get_Vendor, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(

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
        Notiflix.Report.failure(err.msg, '', 'Close');
      });
  };

  vendorType(e) {
    console.log(e);
    this.getVendorData.forEach(x => {
      if (x.vendor_id == e) {
        this.type = x.type;
      }
    })
    console.log(this.type);
  }
  chooseCategory(e) {
    console.log(e);
    if (e != "choose") {
      for (let i = 0; i < this.getCategoryData.length; i++) {
        if (this.getCategoryData[i].cat_id == e) {
          this.itemData = this.getCategoryData[i].itemData;
          this.productname = this.getCategoryData[i].cat_name
        }
      }
      console.log(this.itemData);
    } else {
      Notiflix.Report.failure('choose correct option', '', 'Close');
    }
  }
  chooseItem(e) {
    if (e != "choose") {
      let hsn
      let gst
      let gstvalue
      for (let i = 0; i < this.itemData.length; i++) {
        if (this.itemData[i].item_id == e) {
          gst = this.itemData[i].gst;
          hsn = this.itemData[i].hsn;
          this.itemname = this.itemData[i].item_name
          if (this.type == 'Intra State') {
            gstvalue = gst / 2
            this.productForm.patchValue({
              igst: 0,
              hsn: hsn,
              cgst: gstvalue,
              sgst: gstvalue
            })
          } else {
            gstvalue = gst
            this.productForm.patchValue({
              igst: gstvalue,
              hsn: hsn,
              cgst: 0,
              sgst: 0
            })
          }
        }
        // console.log(this.productForm,'hi');
        console.log(this.productForm)
      }

    } else {
      Notiflix.Report.failure('Choose a correct option', '', 'Close');
      this.productForm.patchValue({
        igst: 0,
        hsn: 0,
        cgst: 0,
        sgst: 0
      })
    }
  }


  calc_total() {
    let prc=this.productForm.get('price').value;
    let qt=this.productForm.get('qty').value;
    let discnt=this.productForm.get('discount').value;
    let igst = this.productForm.get('igst').value;
    let sgst =this.productForm.get('sgst').value;
    let cgst = this.productForm.get('cgst').value;
    let sum = 0
    let total = 0;
    let gstTotal = (igst + cgst + sgst)/100;
    if (qt != null) {
      if(prc != null){
        if(discnt != null){
          sum = sum + ((prc * qt) - discnt);
          total = sum+(sum*gstTotal);
        }else{
          sum = sum + ((prc * qt) - 0);
          total = sum+(sum*gstTotal);
        }
      }
    }
    this.productForm.patchValue({
       total:total
    })
  }

  submitArray() {
    this.productformarray;
    let category
    let value = this.productForm.value
    let duplicatevalue = { ...value }
    console.log(this.getCategoryData);
    this.duplicateproductformarray;
    for (let i = 0; i < this.getCategoryData.length; i++) {
      if (this.getCategoryData[i].cat_id == this.productForm.value.category) {
        duplicatevalue.category = this.getCategoryData[i].cat_name
      }
    }
    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].item_id == this.productForm.value.item_id) {
        duplicatevalue.item_id= this.itemData[i].item_name;
      }
    }
    this.productformarray.push(value)
    this.duplicateproductformarray.push(duplicatevalue)
    console.log(duplicatevalue);
    console.log(this.duplicateproductformarray);
    console.log(this.productformarray);
  }
  delete(i) {
    Notiflix.Report.success('Are you want to delete', '', 'Ok');
    this.productformarray.splice(i, 1)
  }
  openModal() {
    this.productForm.reset()
    this.openmodal = true;
  }
  add_purchase_details = () => {
    this.loader = true;
    console.log(this.purchase_form.get('invo').value,);
    console.log(this.productformarray);
    const reqBody = {
      "invoice": this.purchase_form.get('invo').value,
      "vendor_id": this.purchase_form.get('vendor').value,
      "type": "rawmaterial",
      "date": this.purchase_form.get('p_date').value,
      "purchase_data": this.productformarray
    }

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.purchase_entry, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success('SuccessFully Added', '', 'Close');
        console.log(res, "get item");
        this.get_purchase_details.emit();
        this.purchase_form.reset();
        this.previousPage();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.msg, '', 'Close');
      });
  };
  previousPage() {
    console.log('hii');
    this.BackTab.emit();
  }

}
