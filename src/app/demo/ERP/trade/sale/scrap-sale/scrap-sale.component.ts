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
  selector: 'app-scrap-sale',
  templateUrl: './scrap-sale.component.html',
  styleUrls: ['./scrap-sale.component.scss']
})
export class ScrapSaleComponent implements OnInit {


  getScrapType: any = [];
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
    // public saleService: SaleSrviceService,
    // private datePipe: DatePipe,
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
    // this.get_Category();
    this.get_proddata();
    this.get_Vendor();
    this.add_row();
    this.get_next_invoice()
  }

  get_proddata = () => {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_scrap).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        // this.getScrapType = res.data;
        // let catData = res.data;
        this.getScrapType = res.data
        // for (let i = 0; i < catData.length; i++) {
        //   if (catData[i].delete_stat == 0 && !(this.prodData_id.includes(catData[i].prod_id))) {
        //     this.getScrapType.push(catData[i]);
        //   }
        // }
        console.log(this.getScrapType);
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

  chooseCategory(form_cont, item) {

    form_cont.patchValue({
      discount: 0,
      qty: 1,
    });

    console.log(item);
    console.log(form_cont);
    console.log(this.purchase_form);
    console.log(this.getScrapType);

    if (item != "ChooseProduct") {
      let hsn;
      let gst;
      let GST;
      let gstvalue;
      let mrp;

      for (let i = 0; i < this.getScrapType.length; i++) {
        if (this.getScrapType[i].prod_id == item) {
          GST = parseInt(this.getScrapType[i].gst);
          hsn = this.getScrapType[i].hsn;

          if (this.getScrapType[i].mrp) {
            mrp = this.getScrapType[i].mrp;
            gst = mrp * (GST / 100);
          } else {
            mrp = this.getScrapType[i].price;
            gst = mrp * (GST / 100);
          }
          this.itemname = this.getScrapType[i].prod_name;

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

    for (let i = 0; i < this.getScrapType.length; i++) {
      if (this.getScrapType[i].prod_id == item) {

        GST = parseInt(this.getScrapType[i].gst);
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


  vendorType(e) {
    console.log(e);
    this.getVendorData.forEach(x => {
      if (x.vendor_id == e) {
        this.type = x.type;
      }
    })
    console.log(this.type);
  }

  get_next_invoice = () => {
    this.loader = true;

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
