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
  getCatagoryData: any = [];
  itemData: any = [];
  addmat: FormGroup;
  productformArray: any[]
  openmodal: boolean = false
  total_value: number;
  gstVal: number;
  productformarray: any = [];
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
      prod_name: new FormControl("", [Validators.required]),
      prod_id: new FormControl(""),
      gst: new FormControl("", [Validators.required]),
      stock: new FormControl("", [Validators.required]),
      unit: new FormControl("", [Validators.required]),
      mrp: new FormControl("", [Validators.required]),
      hsn: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.get_Catagory();
    this.get_proddata();
    this.get_Vendor();
    this.add_row();
  }
  get_Catagory = () => {
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.getProduct, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        // this.getCatagoryData = res.data;
        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0) {
            this.getCatagoryData.push(catData[i]);
          }
        }
        console.log(this.getCatagoryData);
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
        // this.getCatagoryData = res.data;
        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0) {
            this.getCatagoryData.push(catData[i]);
          }
        }
        console.log(this.getCatagoryData);
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

  vendorType(e) {
    console.log(e);
    this.getVendorData.forEach(x => {
      if (x.vendor_id == e) {
        this.type = x.type;
      }
    })
    console.log(this.type);
  }
  chooseCategory(form_cont, item) {

    form_cont.patchValue({
      discount: 0,
      qty: 1,
  });

    console.log(item);
    console.log(form_cont);
    console.log(this.item_form);
    console.log(this.getCatagoryData);

    if (item != "ChooseProduct") {
      let hsn;
      let gst;
      let GST;
      let gstvalue;
      let mrp;

      for (let i = 0; i < this.getCatagoryData.length; i++) {
        if (this.getCatagoryData[i].prod_id == item) {
          GST = parseInt(this.getCatagoryData[i].gst);
          hsn = this.getCatagoryData[i].hsn;

          if (this.getCatagoryData[i].mrp) {
            mrp = this.getCatagoryData[i].mrp;
            gst = mrp * (GST / 100);
          } else {
            mrp = this.getCatagoryData[i].price;
            gst = mrp * (GST / 100);
          }
          this.itemname = this.getCatagoryData[i].prod_name;

          if (this.type == 'Intra State') {
            gstvalue = gst / 2;
            form_cont.patchValue({
              igst: 0,
              hsn: hsn,
              cgst: gstvalue,
              sgst: gstvalue,
              price: mrp
            });
          }
          else {
            gstvalue = gst
            form_cont.patchValue({
              igst: gstvalue,
              hsn: hsn,
              cgst: 0,
              sgst: 0,
              price: mrp
            });
          }
        }
      }

    }


    this.calc_total(form_cont.controls);

  }


  calc_total(form_cont) {

    console.log(form_cont);
    

    let prc: number = form_cont.price.value;
    let qt: number = form_cont.qty.value;
   let item = form_cont.item_id.value;

    let gst: number;
    let GST: number;

    for (let i = 0; i < this.getProductData.materials_data.length; i++) {
      if (this.getProductData.materials_data[i].mat_id == item) {

        GST = parseInt(this.getProductData.materials_data[i].mat_gst);
        gst = prc * (GST / 100);
        console.log(GST);
        console.log(this.getProductData.materials_data[i].mat_gst);
        
        console.log(gst);
        
      }
    }

  }

  delete(i) {
    Notiflix.Report.success('Are you want to delete', '', 'Ok');
    this.productformarray.splice(i, 1)
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


  add_purchase_details = () => {

    this.productformarray = [];
    var p_form = this.addmat.get('product')['controls'];
    console.log(p_form);

    for (let i = 0; i < p_form.length; i++) {
      console.log(p_form[i].value);
      this.productformarray.push(p_form[i].value)
    }

    if (this.productformarray) {

      var product_arr = this.productformarray.map((p_array) => {
        return {
          prod_id: p_array.category,
          igst: p_array.igst,
          cgst: p_array.cgst,
          sgst: p_array.sgst,
          price: p_array.price,
          qty: p_array.qty,
          discount: p_array.discount,
          total: p_array.total
        }
      });

    }

    this.loader = true;
    console.log(this.item_form.get('invo').value,);
    console.log(this.productformarray);
    const reqBody = {
      "invoice": this.item_form.get('invo').value,
      "customer_id": this.item_form.get('custmer').value,
      // "type": "rawmaterial",
      "date": this.datePipe.transform(this.item_form.get('p_date').value, 'yyyy-MM-dd'),
      "sell_data": product_arr,
      "payment_status": this.item_form.get('payStatus').value,
      "method": this.item_form.get('payMode').value,
      "paid_amount": this.item_form.get('amnt').value

    }

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.trd_sale_entry, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success('SuccessFully Added', '', 'Close');
        console.log(res, "get item");
        this.get_purchase_details.emit();
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

      item_id: new FormControl('ChooseProduct', [Validators.required]),
      item: new FormControl('ChooseProduct', [Validators.required]),
      gst: new FormControl('', [Validators.required]),
      hsn: new FormControl(''),
      price: new FormControl('0', [Validators.required]),
      qty: new FormControl('1', [Validators.required]),
      unit: new FormControl('0', [Validators.required]),
      total: new FormControl('', [Validators.required]),
      edit: new FormControl(false)

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
