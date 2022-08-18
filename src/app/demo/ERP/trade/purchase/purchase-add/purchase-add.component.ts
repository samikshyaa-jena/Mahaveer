  import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import * as Notiflix from 'notiflix';
  import { finalize } from 'rxjs/operators';
  import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { ErpServiceService } from '../../../erp-service.service';
  import { erp_all_api } from '../../../erpAllApi';
  import { DatePipe } from '@angular/common';
  
  @Component({
    selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss']
  })
  export class PurchaseAddComponent implements OnInit {
  
    getCategoryData: any = [];
    itemData: any = [];
    productForm: FormGroup;
    productformArray: any[]
    openmodal: boolean = false
    total_value: number;
    gstVal: number;
    productformarray: any = [];
    loader: boolean;
    getVendorData: any;
    productname: any;
    itemname: any;
    purchase_form: FormGroup;
    duplicateproductformarray: any = [];
    type: any;
    today = new Date();
  
    @Output() BackTab = new EventEmitter<boolean>();
    @Input() pur_editData: any;
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
      // public saleService: SaleSrviceService,
      private datePipe: DatePipe,
    ) {
  
      this.productForm = new FormGroup({
        "product": new FormArray([
  
        ])
      })
  
      this.purchase_form = new FormGroup({
        invo: new FormControl("", [Validators.required]),
        custmer: new FormControl("choose_cname", [Validators.required]),
        p_date: new FormControl(this.today, [Validators.required])
      });
    }  
  
    ngOnInit(): void {

      if (this.pur_editData) {

        this.purchase_form.patchValue({
          invo: this.pur_editData.invoice_no,
          custmer: this.pur_editData.vendorData.vendor_id,
          p_date: this.pur_editData.purchase_date,
        });
  
        this.type = this.pur_editData.vendorData.type;
        
        var p_form = this.productForm.get('product')['controls'];
        console.log(p_form);
  
        for (let i = 0; i < this.pur_editData.purchase_data.length; i++) {
          this.add_row();
  
          p_form[i].patchValue({
            category: this.pur_editData.purchase_data[i].cat_id,
            item: this.pur_editData.purchase_data[i].item_id,
            igst: this.pur_editData.purchase_data[i].igst,
            cgst: this.pur_editData.purchase_data[i].cgst,
            sgst: this.pur_editData.purchase_data[i].sgst,
            hsn: this.pur_editData.purchase_data[i].hsn,
            price: this.pur_editData.purchase_data[i].purchase_price,
            qty: this.pur_editData.purchase_data[i].quantity,
            discount: this.pur_editData.purchase_data[i].discount,
            total: this.pur_editData.purchase_data[i].total,
          });
          this.calc_total(p_form[i].controls);
  
        }
  
        this.totalCalculation();
      }
      else{
        this.add_row2();
      }
      this.get_Category();
      this.get_Vendor();
    }
    get_Category = () => {
      this.loader = true;
      let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
      let headers = new HttpHeaders();
      headers = headers.set('auth-token', auth_token);
  
      this.ErpService.get_Reqs(erp_all_api.urls.getTradeCat, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
        (res: any) => {
          let catData = res.data;
          for (let i = 0; i < catData.length; i++) {
            if (catData[i].delete_stat == 0 && catData[i].itemData.length > 0) {
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
      this.ErpService.get_Reqs(erp_all_api.urls.get_trd_vendor, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
  
        (res: any) => {
          this.getVendorData = res.data;
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
        item: 'ChooseProduct',
    });
      this.itemData = [];
          for (let i = 0; i < this.getCategoryData.length; i++) {
            if (this.getCategoryData[i].cat_id == item) {
              for (let j = 0; j < this.getCategoryData[i].itemData.length; j++) {
                if (this.getCategoryData[i].itemData[j].delete_stat == 0) {
                  this.itemData.push(this.getCategoryData[i].itemData[j]);
                }              
              }
            }
          }
    }
  
    chooseItem(form_cont, item) {
  
      form_cont.patchValue({
        discount: 0,
        qty: 1,
    });
  
      console.log(item);
      console.log(form_cont);
      console.log(this.purchase_form);
      console.log(this.itemData);
  
      if (item != "ChooseProduct") {
        let hsn;
        let gst;
        let GST;
        let gstvalue;
        let mrp;
  
        for (let i = 0; i < this.itemData.length; i++) {
          if (this.itemData[i].item_id == item) {
            GST = parseInt(this.itemData[i].gst);
            hsn = this.itemData[i].hsn;
  
              mrp = form_cont.controls.price.value;
              gst = mrp * (GST / 100);
            this.itemname = this.itemData[i].item_name;
  
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
  
      let prc: number = form_cont.price.value;
      let qt: number = form_cont.qty.value;
      let discnt: number = form_cont.discount.value;
      let item = form_cont.item.value;
  
      let gst: number;
      let GST: number;
      let igst: number;
      let sgst: number;
      let cgst: number;
  
      for (let i = 0; i < this.itemData.length; i++) {
        if (this.itemData[i].item_id == item) {
  
          GST = parseInt(this.itemData[i].gst);
          gst = prc * (GST / 100);
  
          if (this.type == 'Intra State') {
            igst = 0;
            sgst = gst / 2;
            cgst = gst / 2;
          }
          else {
            igst = gst;
            sgst = 0;
            cgst = 0;
          }
        }
      }
  
      console.log(form_cont);
      // let gstTotal = (igst + cgst + sgst) / 100;
  
      let total: number = 0;
      let total_igst: number = 0;
      let total_cgst: number = 0;
      let total_sgst: number = 0;
  
      if (qt && prc && gst) {
  
        total_igst = igst * qt;
        total_cgst = cgst * qt;
        total_sgst = sgst * qt;
        let gstTotal: number = (total_igst + total_cgst + total_sgst);
  
        if (discnt) {
          total = gstTotal + ((prc * qt) - discnt);
        } else {
          total = gstTotal + ((prc * qt) - 0);
        }
  
        form_cont.total.patchValue(total);
        form_cont.igst.patchValue(total_igst);
        form_cont.cgst.patchValue(total_cgst);
        form_cont.sgst.patchValue(total_sgst);
        console.log(form_cont);
      }
  
    }
  
    delete(i) {
      Notiflix.Report.success('Are you want to delete', '', 'Ok');
      this.productformarray.splice(i, 1)
    }
    resetProductForm() {
      var p_form = this.productForm.get('product')['controls'];
      console.log(p_form);
      p_form.splice(1, p_form.length);
      p_form[0].reset();
      p_form[0].patchValue({
        category: 'ChooseProduct',
        item: 'ChooseProduct',
        price: 0,
        qty: 1,
        discount: 0
      });
      console.log(p_form);
      this.totalCalculation()
    }
  
  
    add_purchase_details = (type) => {

      let url;

    if (type == 'add') {
      url = erp_all_api.urls.trd_purchase_entry;
    } else {
      url = erp_all_api.urls.update_purchase_entry;
    }
  
      this.productformarray = [];
      var p_form = this.productForm.get('product')['controls'];
      console.log(p_form);
  
      for (let i = 0; i < p_form.length; i++) {
        console.log(p_form[i].value);
        this.productformarray.push(p_form[i].value)
      }
  
      if (this.productformarray) {
  
        var product_arr = this.productformarray.map((p_array) => {
          return {
            category: p_array.category,
            item_id: p_array.item,
            hsn: p_array.hsn,
            igst: p_array.igst,
            cgst: p_array.cgst,
            sgst: p_array.sgst,
            price: p_array.price,
            qty: p_array.qty,
            discount: p_array.discount,
            total: p_array.total,
          }
        });
  
      }
  
      this.loader = true;
      console.log(this.purchase_form.get('invo').value,);
      console.log(this.productformarray);
      const reqBody = {
        
        "invoice": this.purchase_form.get('invo').value,
        "vendor_id": this.purchase_form.get('custmer').value,
        "type": "rawmaterial",
        "date": this.datePipe.transform(this.purchase_form.get('p_date').value, 'yyyy-MM-dd'),
        "purchase_data": product_arr,
  
      }
  
      let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
      let headers = new HttpHeaders();
      headers = headers.set('auth-token', auth_token);
  
      this.ErpService.post_Reqs(url, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
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
        item: new FormControl('ChooseProduct', [Validators.required]),
        // prod_id: new FormControl('ChooseItem', [Validators.required]),
        igst: new FormControl('', [Validators.required]),
        cgst: new FormControl('', [Validators.required]),
        sgst: new FormControl('', [Validators.required]),
        hsn: new FormControl(''),
        price: new FormControl('0', [Validators.required]),
        qty: new FormControl('1', [Validators.required]),
        discount: new FormControl('0', [Validators.required]),
        total: new FormControl('', [Validators.required]),
        edit: new FormControl(false)
  
      })
    }
  
    add_row() {
      (<FormArray>this.productForm.get('product')).push(this.productdata())
    }
    add_row2() {
      (<FormArray>this.productForm.get('product')).push(this.productdata())
      var m_form = this.productForm.get('product')['controls'];
      var l: number = (m_form.length) - 1;
      m_form[l].controls.edit.patchValue(true);
    }
    deleteRow(i) {
      (<FormArray>this.productForm.get('product')).removeAt(i)
    }
  
    totalCalculation() {
  
      var pform = this.productForm.get('product')['controls'];
  
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

    Edit(pform, i) {
      console.log(pform);
      console.log(pform.edit.value);
      pform.edit.value = true;
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
  
