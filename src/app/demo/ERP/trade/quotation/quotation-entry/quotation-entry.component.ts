import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Notiflix from 'notiflix';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../../erp-service.service';
import { erp_all_api } from '../../../erpAllApi';
import { SaleSrviceService } from '../../sale/sale-srvice.service';

@Component({
  selector: 'app-quotation-entry',
  templateUrl: './quotation-entry.component.html',
  styleUrls: ['./quotation-entry.component.scss']
})
export class QuotationEntryComponent implements OnInit {

  getCatagoryData: any = [];
  itemData: any = [];
  QuotationForm: FormGroup;
  quotationformarray: any[]
  openmodal: boolean = false
  total_value: number;
  gstVal: number;
  productformarray: any = [];
  loader: boolean;
  getVendorData: any = [];
  productname: any;
  itemname: any;
  quotation_form: FormGroup;
  duplicateproductformarray: any = [];
  type: any;
  today = new Date();

  @Output() BackTab = new EventEmitter<boolean>()
  @Output() get_purchase_details: EventEmitter<any> = new EventEmitter();
  showInps: boolean = false;

  t_igst: number;
  t_sgst: number;
  t_cgst: number;
  t_amount: number;

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public saleService: SaleSrviceService,
    private datePipe: DatePipe,
  ) {

    this.QuotationForm = new FormGroup({
      "product": new FormArray([

      ])
    })
    this.quotation_form = new FormGroup({
      quto: new FormControl("", [Validators.required]),
      custmer: new FormControl("choose_cname", [Validators.required]),
      q_date: new FormControl(this.today, [Validators.required]),
      priority: new FormControl("choose_quot", [Validators.required]),
      amnt: new FormControl("0", [Validators.required]),
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

    console.log(item);
    console.log(form_cont);
    console.log(this.quotation_form);
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

    // console.log(this.QuotationForm.value);

    let prc: any = form_cont.price.value;
    let qt: any = form_cont.qty.value;
    let discnt: any = form_cont.discount.value;
    let igst: any = form_cont.igst.value;
    let sgst: any = form_cont.sgst.value;
    let cgst: any = form_cont.cgst.value;
    // let sum = 0
    let total = 0;
    let total_igst = 0;
    let total_cgst = 0;
    let total_sgst = 0;
    // let gstTotal = (igst + cgst + sgst) / 100;
    if (qt && prc) {

      total_igst = igst * qt;
      total_cgst = cgst * qt;
      total_sgst = sgst * qt;
      let gstTotal = (total_igst + total_cgst + total_sgst);

      if (discnt) {
        total = gstTotal + ((prc * qt) - discnt);
      } else {
        total = gstTotal + ((prc * qt) - 0);
      }

    }
    // if (qt != null) {
    //   if (prc != null) {
    //     if (discnt != null) {
    //       sum = sum + ((prc * qt) - discnt);
    //       total = sum + (sum * gstTotal);
    //     } else {
    //       sum = sum + ((prc * qt) - 0);
    //       total = sum + (sum * gstTotal);
    //     }
    //   }
    // }
    form_cont.total.patchValue(total);
    form_cont.igst.patchValue(total_igst);
    form_cont.cgst.patchValue(total_cgst);
    form_cont.sgst.patchValue(total_sgst);
    console.log(form_cont);
  }

  // submitArray() {
  //   this.showInps = true;
  //   // this.productformarray;
  //   let category
  //   let value = this.QuotationForm.value.product[0]
  //   // let value = p_form.value
  //   var p_form = this.QuotationForm.get('product')['controls'];
  //   let duplicatevalue = { ...value }
  //   console.log(this.getCatagoryData);
  //   this.duplicateproductformarray;
  //   for (let i = 0; i < this.getCatagoryData.length; i++) {
  //     if (this.getCatagoryData[i].cat_id == p_form.value.category) {
  //       duplicatevalue.category = this.getCatagoryData[i].cat_name
  //     }
  //   }
  //   for (let i = 0; i < this.getCatagoryData.length; i++) {
  //     if (this.getCatagoryData[i].prod_id == p_form.value.prod_id) {
  //       duplicatevalue.prod_id = this.getCatagoryData[i].prod_name;
  //     }
  //   }

  //   for (let i = 0; i < this.QuotationForm.get('product')['controls'].length; i++) {
  //     console.log(this.QuotationForm.get('product')['controls'][i].value);
  //     this.productformarray.push(this.QuotationForm.get('product')['controls'][i].value)
  //   }

  //   // this.productformarray.push(value)
  //   this.duplicateproductformarray.push(duplicatevalue)
  //   console.log(duplicatevalue);
  //   console.log(this.duplicateproductformarray);
  //   console.log(this.productformarray);
  //   let sum = 0;
  //   for (let i = 0; i < this.productformarray.length; i++) {
  //     sum = sum + this.productformarray[i].total;
  //   }
  //   this.quotation_form.patchValue({
  //     payMode: 'Cash',
  //     payStatus: 'Paid',
  //     amnt: sum,
  //   })
  // }
  delete(i) {
    Notiflix.Report.success('Are you want to delete', '', 'Ok');
    this.productformarray.splice(i, 1)
  }
  // openModal() { 
  //   p_form.reset()
  //   this.openmodal = true;
  // }


  resetProductForm() {
    var p_form = this.QuotationForm.get('product')['controls'];
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


  add_quotation_details = () => {


    this.quotationformarray = [];
    var p_form = this.QuotationForm.get('product')['controls'];
    console.log(p_form);

    for (let i = 0; i < p_form.length; i++) {
      console.log(p_form[i].value);
      this.quotationformarray.push(p_form[i].value)
    }

    if (this.quotationformarray) {

      var quotation_arr = this.quotationformarray.map((p_array) => {
        return {
          prod_id: p_array.prud,
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
    console.log(this.quotation_form.get('quto').value,);
    console.log(this.quotationformarray);

    const reqBody = {
      "quotation_no": this.quotation_form.get('quto').value,
      "customer_id": this.quotation_form.get('custmer').value,
      "priority": this.quotation_form.get('priority').value,
      "date": this.datePipe.transform(this.quotation_form.get('q_date').value, 'yyyy-MM-dd'),
      "quote_data": quotation_arr,
      "paid_amount": this.quotation_form.get('amnt').value,
      "status": "QUOTATION"
    };

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.quotation_add, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success('SuccessFully Added', '', 'Close');
        console.log(res, "get item");
        // this.get_purchase_details.emit();
        this.quotation_form.reset();
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
    (<FormArray>this.QuotationForm.get('product')).push(this.productdata())
  }
  deleteRow(i) {
    (<FormArray>this.QuotationForm.get('product')).removeAt(i)
  }

  totalCalculation() {

    var pform = this.QuotationForm.get('product')['controls'];

    this.t_igst = 0;
    this.t_sgst = 0;
    this.t_cgst = 0;
    this.t_amount = 0;

    for (let i = 0; i < pform.length; i++) {
      this.t_igst = this.t_igst + pform[i].value.igst;
      this.t_sgst = this.t_sgst + pform[i].value.sgst;
      this.t_cgst = this.t_cgst + pform[i].value.cgst;
      this.t_amount = this.t_amount + pform[i].value.total;
    }

  }

  prevent(e, type) {
    console.log(e);

    if (type == 'qty') {
      if (e.key > '0') {
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
