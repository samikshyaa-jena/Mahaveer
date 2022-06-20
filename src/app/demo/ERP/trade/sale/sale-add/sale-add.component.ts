import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { finalize } from 'rxjs/operators';
// import { ErpServiceService } from '../../erp-service.service';
// import { erp_all_api } from '../../erpAllApi';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErpServiceService } from '../../../erp-service.service';
import { SaleSrviceService } from '../sale-srvice.service';
import { erp_all_api } from '../../../erpAllApi';
// import { SaleSrviceService } from './sale-srvice.service';

@Component({
  selector: 'app-sale-add',
  templateUrl: './sale-add.component.html',
  styleUrls: ['./sale-add.component.scss']
})
export class SaleAddComponent implements OnInit {

  getCatagoryData: any = [];
  itemData: any = [];
  productForm: FormGroup;
  productformArray: any[]
  openmodal: boolean = false
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
  showInps: boolean = false;

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public saleService: SaleSrviceService,
  ) {

    this.productForm = new FormGroup({
      "product": new FormArray([

      ])
    })
    // p_form = new FormGroup({
    // category: new FormControl('ChooseCategory', [Validators.required]),
    // prod_id: new FormControl('ChooseItem', [Validators.required]),
    // igst: new FormControl('', [Validators.required]),
    // cgst: new FormControl('', [Validators.required]),
    // sgst: new FormControl('', [Validators.required]),
    // hsn: new FormControl(''),
    // price: new FormControl('0', [Validators.required]),
    // qty: new FormControl('1', [Validators.required]),
    // discount: new FormControl('0', [Validators.required]),
    // total: new FormControl('', [Validators.required])
    // })
    this.purchase_form = new FormGroup({
      invo: new FormControl("", [Validators.required]),
      custmer: new FormControl("choose_cname", [Validators.required]),
      p_date: new FormControl("", [Validators.required]),
      amnt: new FormControl(""),
      payMode: new FormControl(""),
      payStatus: new FormControl(""),
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
  chooseCategory(e) {
    console.log(e);
    if (e != "choose") {
      for (let i = 0; i < this.getCatagoryData.length; i++) {
        if (this.getCatagoryData[i].cat_id == e) {
          this.itemData = this.getCatagoryData[i].itemData;
          this.productname = this.getCatagoryData[i].cat_name
        }
      }

      let x = this.itemData;
      this.itemData = [];
      for (let i = 0; i < x.length; i++) {
        if (x[i].delete_stat == 0) {
          this.itemData.push(x[i]);
        }
      }

      console.log(this.itemData);
    } else {
      Notiflix.Report.failure('choose correct option', '', 'Close');
    }
  }
  chooseItem(e, p_form: any) {
    console.log("gfekjdf");
    
    if (e != "choose") {
      let hsn;
      let gst;
      let gstvalue;
      let mrp;
      console.log(this.itemData);

      for (let i = 0; i < this.itemData.length; i++) {
        if (this.itemData[i].prod_id == e) {
          gst = parseInt(this.itemData[i].gst);
          hsn = this.itemData[i].hsn;
          mrp = this.itemData[i].mrp;
          this.itemname = this.itemData[i].prod_name
          if (this.type == 'Intra State') {
            gstvalue = gst / 2
            this.productForm.patchValue({
              p_form: {
                igst: 0,
              hsn: hsn,
              cgst: gstvalue,
              sgst: gstvalue,
              price: mrp
              }
            });
            // this.productForm.patchValue({
            //   igst: 0,
            //   hsn: hsn,
            //   cgst: gstvalue,
            //   sgst: gstvalue,
            //   price: mrp
            // })
          } else {
            gstvalue = gst
            this.productForm.patchValue({
              p_form: {
                igst: gstvalue,
                hsn: hsn,
                cgst: 0,
                sgst: 0,
                price: mrp
              }
            });
            // this.productForm.patchValue({
            //   igst: gstvalue,
            //   hsn: hsn,
            //   cgst: 0,
            //   sgst: 0,
            //   price: mrp
            // })
          }
        }
        console.log(p_form)
      }

    } else {
      Notiflix.Report.failure('Choose a correct option', '', 'Close');
      this.productForm.patchValue({
        p_form: {
          igst: 0,
          hsn: 0,
          cgst: 0,
          sgst: 0
        }
      });
      // this.productForm.patchValue({
      //   igst: 0,
      //   hsn: 0,
      //   cgst: 0,
      //   sgst: 0
      // })


    }
  }


  calc_total(p_form: any) {
    console.log(this.productForm.value);
    
    let prc: any = this.productForm.value.product[p_form].price;
    let qt: any = this.productForm.value.product[p_form].qty;
    let discnt: any = this.productForm.value.product[p_form].discount;
    let igst: any = this.productForm.value.product[p_form].igst;
    let sgst: any = this.productForm.value.product[p_form].sgst;
    let cgst: any = this.productForm.value.product[p_form].cgst;
    let sum = 0
    let total = 0;
    let gstTotal = (igst + cgst + sgst) / 100;
    if (qt != null) {
      if (prc != null) {
        if (discnt != null) {
          sum = sum + ((prc * qt) - discnt);
          total = sum + (sum * gstTotal);
        } else {
          sum = sum + ((prc * qt) - 0);
          total = sum + (sum * gstTotal);
        }
      }
    }
    this.productForm.patchValue({
      p_form: {
        total: total
      }
    });
  }

  submitArray(p_form) {
    this.showInps = true;
    this.productformarray;
    let category
    let value = p_form.value
    let duplicatevalue = { ...value }
    console.log(this.getCatagoryData);
    this.duplicateproductformarray;
    for (let i = 0; i < this.getCatagoryData.length; i++) {
      if (this.getCatagoryData[i].cat_id == p_form.value.category) {
        duplicatevalue.category = this.getCatagoryData[i].cat_name
      }
    }
    for (let i = 0; i < this.itemData.length; i++) {
      if (this.itemData[i].prod_id == p_form.value.prod_id) {
        duplicatevalue.prod_id = this.itemData[i].prod_name;
      }
    }
    this.productformarray.push(value)
    this.duplicateproductformarray.push(duplicatevalue)
    console.log(duplicatevalue);
    console.log(this.duplicateproductformarray);
    console.log(this.productformarray);
    let sum = 0;
    for (let i = 0; i < this.productformarray.length; i++) {
      sum = sum + this.productformarray[i].total;
    }
    this.purchase_form.patchValue({
      payMode: 'Cash',
      payStatus: 'Paid',
      amnt: sum,
    })
  }
  delete(i) {
    Notiflix.Report.success('Are you want to delete', '', 'Ok');
    this.productformarray.splice(i, 1)
  }
  // openModal() { 
  //   p_form.reset()
  //   this.openmodal = true;
  // }
  add_purchase_details = () => {
    this.loader = true;
    console.log(this.purchase_form.get('invo').value,);
    console.log(this.productformarray);
    const reqBody = {
      "invoice": this.purchase_form.get('invo').value,
      "customer_id": this.purchase_form.get('custmer').value,
      "type": "rawmaterial",
      "date": this.purchase_form.get('p_date').value,
      "sell_data": this.productformarray,
      "payment_status": this.purchase_form.get('payStatus').value,
      "method": this.purchase_form.get('payMode').value,
      "paid_amount": this.purchase_form.get('amnt').value

    }

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.trd_sale_entry, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success('SuccessFully Added', '', 'Close');
        console.log(res, "get item");
        this.get_purchase_details.emit();
        this.purchase_form.reset();
        this.previousPage();
      },
      (err: any) => {
        console.log(err);
        console.log(err.error.msg);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };
  previousPage() {
    console.log('hii');
    this.BackTab.emit();
  }

  productdata(): FormGroup {
    return this.fb.group({

      category: new FormControl('ChooseProduct', [Validators.required]),
      // prod_id: new FormControl('ChooseItem', [Validators.required]),
      igst: new FormControl('', [Validators.required]),
      cgst: new FormControl('', [Validators.required]),
      sgst: new FormControl('', [Validators.required]),
      hsn: new FormControl(''),
      price: new FormControl('0', [Validators.required]),
      qty: new FormControl('1', [Validators.required]),
      discount: new FormControl('0', [Validators.required]),
      total: new FormControl('', [Validators.required])

    })
  }

  add_row() {
    (<FormArray>this.productForm.get('product')).push(this.productdata())
  }
  deleteRow(i) {
    (<FormArray>this.productForm.get('product')).removeAt(i)
  }

  purches_validation(value) {
    if (value) {
      document.getElementById('category').removeAttribute('disabled');
      document.getElementById('prod_id').removeAttribute('disabled');
      document.getElementById('price').removeAttribute('disabled');
      document.getElementById('qty').removeAttribute('disabled');
      document.getElementById('discount').removeAttribute('disabled');

    } else {
      document.getElementById('category').setAttribute('disabled', 'true');
      document.getElementById('prod_id').setAttribute('disabled', 'true');
      document.getElementById('price').setAttribute('disabled', 'true');
      document.getElementById('qty').setAttribute('disabled', 'true');
      document.getElementById('discount').setAttribute('disabled', 'true');
    }
  }

}
