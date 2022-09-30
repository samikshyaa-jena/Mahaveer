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
import { DatePipe } from '@angular/common';
// import { SaleSrviceService } from './sale-srvice.service';

@Component({
  selector: 'app-sale-add',
  templateUrl: './sale-add.component.html',
  styleUrls: ['./sale-add.component.scss']
})
export class SaleAddComponent implements OnInit {

  getCategoryData: any = [];
  prodData_id: any = [];
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
  today = new Date();


  @Output() BackTab = new EventEmitter<boolean>()
  @Output() get_purchase_details: EventEmitter<any> = new EventEmitter();
  showInps: boolean = false;

  t_igst: number;
  t_sgst: number;
  t_cgst: number;
  t_amount: number;
  inv_no: string;

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

    this.productForm = new FormGroup({
      "product": new FormArray([

      ])
    })
    
    this.purchase_form = new FormGroup({
      invo: new FormControl("", [Validators.required]),
      custmer: new FormControl("choose_cname", [Validators.required]),
      p_date: new FormControl(this.today, [Validators.required]),
      amnt: new FormControl("0", [Validators.required]),
      payMode: new FormControl("choosepaymode", [Validators.required]),
      payStatus: new FormControl("choosepay", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.get_Category();
    this.get_proddata();
    this.get_Vendor();
    this.add_row();
    this.get_next_invoice()

  }
  get_Category = () => {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.getProduct).pipe(finalize(() => { this.loader = false; })).subscribe(
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
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_prod).pipe(finalize(() => { this.loader = false; })).subscribe(
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
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);
    this.ErpService.get_Reqs(erp_all_api.urls.get_cust).pipe(finalize(() => { this.loader = false; })).subscribe(

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
    console.log(this.purchase_form);
    console.log(this.getCategoryData);

    if (item != "ChooseProduct") {
      let hsn;
      let gst;
      let GST;
      let gstvalue;
      let mrp;

      for (let i = 0; i < this.getCategoryData.length; i++) {
        if (this.getCategoryData[i].prod_id == item) {
          GST = parseInt(this.getCategoryData[i].gst);
          hsn = this.getCategoryData[i].hsn;

          if (this.getCategoryData[i].mrp) {
            mrp = this.getCategoryData[i].mrp;
            gst = mrp * (GST / 100);
          } else {
            mrp = this.getCategoryData[i].price;
            gst = mrp * (GST / 100);
          }
          this.itemname = this.getCategoryData[i].prod_name;

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
    let item = form_cont.category.value;

    let gst: number;
    let GST: number;
    let igst: number;
    let sgst: number;
    let cgst: number;

    for (let i = 0; i < this.getCategoryData.length; i++) {
      if (this.getCategoryData[i].prod_id == item) {

        GST = parseInt(this.getCategoryData[i].gst);
        gst = prc * (GST / 100);

        if (this.type == 'Intra State') {
          igst = 0;
          sgst = parseFloat((gst / 2).toFixed(2));
          cgst = parseFloat((gst / 2).toFixed(2));
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

    if (qt) {

      total_igst = parseFloat((igst * qt).toFixed(2));
      total_cgst = parseFloat((cgst * qt).toFixed(2));
      total_sgst = parseFloat((sgst * qt).toFixed(2));
      let gstTotal: number = (total_igst + total_cgst + total_sgst);

      if (discnt) {
        total = parseFloat((gstTotal + ((prc * qt) - discnt)).toFixed(2));
      } else {
        total = parseFloat((gstTotal + ((prc * qt) - 0)).toFixed(2));
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
  // openModal() { 
  //   p_form.reset()
  //   this.openmodal = true;
  // }


  resetProductForm() {
    var p_form = this.productForm.get('product')['controls'];
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
    var p_form = this.productForm.get('product')['controls'];
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
          total: p_array.total,
          igst_rate: p_array.igst == 0 ? 0: (p_array.igst/p_array.price),
          cgst_rate: p_array.cgst == 0 ? 0: (p_array.cgst/p_array.price),
          sgst_rate: p_array.sgst == 0 ? 0: (p_array.sgst/p_array.price)
        }
      });

    }

    this.loader = true;
    console.log(this.purchase_form.get('invo').value,);
    console.log(this.productformarray);
    const reqBody = {
      "invoice": this.purchase_form.get('invo').value,
      "customer_id": this.purchase_form.get('custmer').value,
      // "type": "rawmaterial",
      "date": this.datePipe.transform(this.purchase_form.get('p_date').value, 'yyyy-MM-dd'),
      "sell_data": product_arr,
      "payment_status": this.purchase_form.get('payStatus').value,
      "method": this.purchase_form.get('payMode').value,
      "paid_amount": this.purchase_form.get('amnt').value

    }

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.trd_sale_entry, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
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

  get_next_invoice = () => {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);
    this.ErpService.get_Reqs(erp_all_api.urls.get_next_invoice_no).pipe(finalize(() => { this.loader = false; })).subscribe(

      (res: any) => {
        let vendorData = res.data;

        this.purchase_form.get('invo').setValue(vendorData)
   
      },

      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };

}
