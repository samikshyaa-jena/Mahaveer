import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../erp-service.service';
import { erp_all_api } from '../../erpAllApi';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaleSrviceService } from './sale-srvice.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

  purchase_form: FormGroup;
  vendor_data: any;
  vendor_name: any = [];
  item_data: any;
  item_name: any = [];
  dynamicManufacture: FormGroup;
  total_value: any = [];
  get_purchase_data: any = [];
  total_value1: number;
  purchase_data: any;
  purchase_tab: boolean;
  gstVal: any;
  control: FormGroup;
  getCatagoryData: any;
  itemList: any;
  cat_id: any;
  hsn: any;
  cat_data: any;
  itemData: any;
  Item_name: any;
  formArrayValue: any;
  modal: boolean;
  modal1: boolean=false;
  popupData: any = [];
  x: boolean;
  y: boolean;
  z: boolean;
  loader: boolean;
  invoData: any[];
  productname: any;
  updatePurchase: FormGroup;
  purchase_dataArray: any = [];
  enable: boolean = false;
  gi: any;
  updateData: any;
  invoiceNo: any;
  vendData: any;
  dummy: any =  [];
  customerSelectedId: any;
  cattName: any;
  proddName: any;
  catt_id: any;
  prodd_id: any;

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public saleService: SaleSrviceService,
  ) { 
    this.purchase_form = new FormGroup({
      invo: new FormControl("", [Validators.required]),
      vendor: new FormControl("", [Validators.required]),
      p_date: new FormControl("", [Validators.required]),


    });
    this.dynamicManufacture = this.fb.group({
      manufacture: this.fb.array([])
    });

    this.updatePurchase = new FormGroup({
      catagory: new FormControl(""),
      prod_id: new FormControl(""),
      hsn: new FormControl(""),
      price: new FormControl(""),
      qty: new FormControl(""),
      // unit: new FormControl(""),
      discount: new FormControl(""),
      cgst: new FormControl(""),
      sgst: new FormControl(""),
      igst: new FormControl(""),
      total: new FormControl(""),
    });
   }

   ngOnInit() {
    this.get_Catagory();
    this.get_Vendor();
    this.get_Item();
    this.get_purchase_details();
  }

  get_Catagory = () => {

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.getTradeCat, { headers: headers }).pipe(finalize(() => { })).subscribe(
      (res: any) => {
        this.getCatagoryData = res.data;
        console.log("response is", this.getCatagoryData);
        console.log("resps", Object.values(this.getCatagoryData));
      },
      (err: any) => {
        console.log(err);
      });
  };

  purchase_entry = () => {
    this.purchase_tab = true;
  }
  back_table = () => {
    this.purchase_tab = false;
    this.dynamicManufacture.reset();
    this.purchase_form.reset();
  }

  get UserFormGroups() {
    return this.dynamicManufacture.get('manufacture') as FormArray
  }
  add_more_item() {
    this.control = new FormGroup({
      'cat_name': new FormControl(null),
      'item_id': new FormControl(null),
      'GST': new FormControl(null),
      'hsn': new FormControl(null),
      'price': new FormControl(null),
      'qty': new FormControl(null),
      'discount': new FormControl(null),
      'total': new FormControl(null),
    });
    (<FormArray>this.dynamicManufacture.get('manufacture')).push(this.control)
  }
  delete(e) {
    (<FormArray>this.dynamicManufacture.get('manufacture')).removeAt(e)

  }

  get_Vendor = () => {

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_cust, { headers: headers }).pipe(finalize(() => { })).subscribe(
      (res: any) => {
        console.log(res);
        this.vendor_data = res
        console.log(this.vendor_data);
      },
      (err: any) => {
        console.log(err);

      });

  };

  get_Item = () => {

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_prod, { headers: headers }).pipe(finalize(() => { })).subscribe(
      (res: any) => {
        console.log(res, "get item");

        this.item_data = res.data.map((val) => {
          return { item_name: val.item_name, item_id: val.item_id, gst: val.gst };
        });
        console.log(this.item_data);
        for (let i = 0; i < this.item_data.length; i++) {
          this.item_name[i] = this.item_data[i].item_name;
        }
        console.log(this.item_name);
      },
      (err: any) => {
        console.log(err);

      });

  };

  chooseCategory(e) {
    console.log(e);
    if (e != "choose") {
      for (let i = 0; i < this.getCatagoryData.length; i++) {
        if (this.getCatagoryData[i].cat_id == e) {
          this.itemData = this.getCatagoryData[i].itemData;
          this.productname = this.getCatagoryData[i].prod_name
        }
      }
      console.log(this.itemData);
    } else {
      Notiflix.Report.failure('choose correct option', '', 'Close');
    }
  }

  updateArray = () => {
    console.log(this.updatePurchase.value);
    this.popupData[this.gi] = this.updatePurchase.value;
    // this.popupData[this.gi] = this.updatePurchase.value;
    // this.popupData[this.gi] = this.updatePurchase.value;
    console.log(this.popupData, "hhhhhhhhhhhhhhh");
    for (let i = 0; i < this.popupData.length; i++) {
      this.purchase_dataArray[i] = this.popupData[i];
    }
    console.log(this.purchase_dataArray);

    this.enable = true;
    console.log(this.updatePurchase.value);
    this.modalService.dismissAll('updt');
    this.purchase_dataArray = this.purchase_dataArray.filter((el) => {
      return el != null;
    });
  }
  calc_total() {
    let prc=this.updatePurchase.get('price').value;
    let qt=this.updatePurchase.get('qty').value;
    let discnt=this.updatePurchase.get('discount').value;
    let igst = this.updatePurchase.get('igst').value;
    let sgst =this.updatePurchase.get('sgst').value;
    let cgst = this.updatePurchase.get('cgst').value;
    let total = 0;
    let gstTotal = (igst + cgst + sgst)/100;
    let sum = 0;
    sum = qt*prc
    total = ((sum*gstTotal) + sum)-discnt;
    this.updatePurchase.patchValue({
       total:total
    })
  }

  openUpdatePucrchase = (i, d, updt) => {
    this.gi = i
    this.modalService.open(updt);
    let total = 0;
    let igstVal = 0;
    let cgstVal = 0;
    let sgstVal = 0;
    this.updateData = d
    console.log("pop====.>", this.updateData);
    for (let i = 0; i < this.updateData.length; i++) {
      let cgstBarri = this.updateData[i].cgst;
      let igstBarri = this.updateData[i].igst;
      let sgstBarri = this.updateData[i].sgst;
      let priceBarri = this.updateData[i].price;
      let qtyBarri = this.updateData[i].quantity;
      priceBarri = priceBarri*qtyBarri;
      igstVal = (igstBarri/100)*priceBarri;
      sgstVal = (sgstBarri/100)*priceBarri;
      cgstVal = (cgstBarri/100)*priceBarri;
      this.updateData[i].igstVal = igstVal;
      this.updateData[i].sgstVal = sgstVal;
      this.updateData[i].cgstVal = cgstVal;
    };
    this.updateData.totalData = total;
    console.log(this.updateData.total);
    console.log(this.updateData);

    this.cattName = this.updateData[i].cat_name;
    this.catt_id = this.updateData[i].cat_name;
    this.proddName = this.updateData[i].prod_name;
    this.prodd_id = this.updateData[i].prod_name;
    this.updatePurchase.patchValue({
      catagory: this.cattName,
      prod_id: this.proddName,
      hsn: this.updateData[i].hsn,
      price: this.updateData[i].price,
      qty: this.updateData[i].qty,
      unit: this.updateData[i].unit,
      discount: this.updateData[i].discount,
      cgst: this.updateData[i].cgst,
      sgst: this.updateData[i].sgst,
      igst: this.updateData[i].igst,
      total: this.updateData[i].total,
    });
  };
  closeUpdateForm = (updt) => {
    this.modalService.dismissAll(updt);
  }

  update_purchase_details = () => {
    this.loader = true;
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const reqBody = {
      "invoice": this.invoiceNo,
      "customer_id":this.customerSelectedId,
      "date": date,
      "payment_status": "paid",
      "paid": 0,
      "method": "cheque",
      "sell_data": this.purchase_dataArray
    }

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.trd_updt_sale_entry, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res, "get update_purchase_entry");
        Notiflix.Report.success(res.msg, '', 'Close');
        this.modal = false;
        this.get_purchase_details();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };




  item_list = (e) => {
    for (let i = 0; i < this.getCatagoryData.length; i++) {
      if (this.getCatagoryData[i].cat_id == e) {
        this.itemData = this.getCatagoryData[i].itemData;
      }
    }
    console.log(this.itemData);
  }
  get_gst = (e) => {
    let form_object = this.dynamicManufacture.value
    console.log(form_object);
    console.log(e);
    this.itemData.forEach(element => {
      console.log(element);
      if (element.item_id == e) {
        this.gstVal = element.gst
        this.hsn = element.hsn
        this.Item_name = element.item_name
      }

    });

    console.log(this.gstVal);
    console.log(this.hsn);
    console.log(this.Item_name);

    this.control.controls['GST'].setValue(this.gstVal);
    this.control.controls['hsn'].setValue(this.hsn);
  }


  get_purchase_details = () => {
    this.loader = true;

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.trd_get_sale_entry, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);

        this.get_purchase_data = res.data;
        let totaldata = []
        let totalIgst = []
        let totalCgst = []
        let totalSgst = []
        let p = [];
        let k = 0
        let g = 0
        let c = 0
        let s = 0
        let purchase_data = []
        let igst = []
        let cgst = []
        let sgst = []
        for (let i = 0; i < this.get_purchase_data.length; i++) {
          purchase_data = this.get_purchase_data[i].sellData
          for (let j = 0; j < purchase_data.length; j++) {
            console.log("pur data==>", purchase_data[j]);
            p[j] = purchase_data[j].total;
            igst[j] = gst_rev(purchase_data[j].total, purchase_data[j].igst);
            cgst[j] = gst_rev(purchase_data[j].total, purchase_data[j].cgst);
            sgst[j] = gst_rev(purchase_data[j].total, purchase_data[j].sgst);
            //  sum
            k = k + p[j];
            totaldata[i] = k;
            // igst
            g = g + igst[j];
            totalIgst[i] = g;
            // cgst
            c = c + cgst[j];
            totalCgst[i] = c;
            //sgst
            s = s + sgst[j];
            totalSgst[i] = s;

            totalIgst[i] = (totalIgst[i] == 0) ? "NA" : totalIgst[i] //+ " %";
            totalCgst[i] = (totalCgst[i] == 0) ? "NA" : totalCgst[i] //+ " %";
            totalSgst[i] = (totalSgst[i] == 0) ? "NA" : totalSgst[i] //+ " %";
            this.get_purchase_data[i].totalsum = totaldata[i];
            this.get_purchase_data[i].totaligst = totalIgst[i];
            this.get_purchase_data[i].totalcgst = totalCgst[i];
            this.get_purchase_data[i].totalsgst = totalSgst[i];
          }
          k = 0;
          g = 0;
          c = 0;
          s = 0
        }
        console.log(totaldata);
        console.log(totaldata);
        console.log(this.get_purchase_data, "get_purchase_data");
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure('Something went wrong...', '', 'Close');
      });

  };

  add_purchase_details = () => {debugger;
    this.loader = true;
    console.log(this.purchase_data[0].price);
    const reqBody = {
      "invoice": this.purchase_form.get('invo').value,
      "vendor_id": this.purchase_form.get('vendor').value,
      "type": 'rawmaterial',
      "purchase_data": this.purchase_data[0],
      "date": this.purchase_form.get('p_date').value
    }

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.trd_sale_entry, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res, "get item");
        Notiflix.Report.success(res.msg, '', 'Close');
        this.get_purchase_details();
        this.purchase_tab = false;
        this.dynamicManufacture.reset();
        this.purchase_form.reset();
        this.purchase_form.reset();
        this.purchase_tab = false;
        this.back();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });

  };

  invoicenumberPopup(o, s, c,i) {
    console.log(c, "customer data................");
    console.log(s, "sale data................");
    this.vendData = c;
    console.log(i);
   this.customerSelectedId=this.vendor_data.data[i].customer_id
    // console.log( );


    this.purchase_dataArray = [];
    console.log(o);
    this.invoiceNo = o;

    let total = 0;
    let igstVal = 0;
    let cgstVal = 0;
    let sgstVal = 0;
    this.dummy = [
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
                bill_amount: '',
      },
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
                bill_amount: '',
      },
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
                bill_amount: '',
      },
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
                bill_amount: '',
      },
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
                bill_amount: '',
      },
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
                bill_amount: '',
      },
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
        bill_amount: '',

      },
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
        bill_amount: '',

      },
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
        bill_amount: '',

      },
      {
        catagory: '',
        catagoryName: '',
        item_id: '',
        itemName: '',
        hsn: '',
        price: '',
        qty: '',
        unit: '',
        discount: '',
        cgst: '',
        sgst: '',
        igst: '',
        cgstVal: '',
        sgstVal: '',
        igstVal: '',
        total: '',
        bill_amount: '',
      },
    ];
    this.popupData = s;
    console.log("pop====.>", this.popupData);
    for (let i = 0; i < this.popupData.length; i++) {
      let cgstBarri = this.popupData[i].cgst;
      let igstBarri = this.popupData[i].igst;
      let sgstBarri = this.popupData[i].sgst;
      let priceBarri = this.popupData[i].price;
      let qtyBarri = this.popupData[i].quantity;
      priceBarri = priceBarri*qtyBarri;
      igstVal = (igstBarri/100)*priceBarri;
      sgstVal = (sgstBarri/100)*priceBarri;
      cgstVal = (cgstBarri/100)*priceBarri;
      this.popupData[i].igstVal = igstVal;
      this.popupData[i].sgstVal = sgstVal;
      this.popupData[i].cgstVal = cgstVal;
    }
    this.popupData.totalData = total;

    console.log(this.popupData.total);
    console.log(this.popupData);
    let allData = this.popupData;
    this.popupData = [];
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].delete_stat != 1) {
        this.popupData.push(allData[i]);
      }
    }
    console.log(this.popupData);
    this.modal = true;
    this.loader = true;
    for (let l = 0; l < this.popupData.length; l++) {
      this.dummy[l].catagory = this.popupData[l].cat_id;
      this.dummy[l].cat_name = this.popupData[l].cat_name
      this.dummy[l].prod_id = this.popupData[l].prod_id;
      this.dummy[l].prod_name = this.popupData[l].prod_name;
      this.dummy[l].hsn = this.popupData[l].hsn;
      this.dummy[l].price = this.popupData[l].price;
      this.dummy[l].qty = this.popupData[l].quantity;
      this.dummy[l].unit = this.popupData[l].unit;
      this.dummy[l].discount = this.popupData[l].discount;
      this.dummy[l].cgst = this.popupData[l].cgst;
      this.dummy[l].sgst = this.popupData[l].sgst;
      this.dummy[l].igst = this.popupData[l].igst;
      this.dummy[l].cgstVal = this.popupData[l].cgstVal;
      this.dummy[l].sgstVal = this.popupData[l].sgstVal;
      this.dummy[l].igstVal = this.popupData[l].igstVal;
      this.dummy[l].total = this.popupData[l].total;
      this.dummy[l].bill_amount = this.popupData[l].total;

    }

    this.dummy =  this.dummy.filter((el) => {
      return el.catagory !=  '';
    });
    console.log(this.dummy);
    this.popupData = this.dummy;
    console.log(this.popupData);
    this.saleService.sendData(this.vendData,this.popupData,this.invoiceNo);
    this.loader = false;
  }


  // invoicenumberPopup(d) {
  //   let total = 0;
  //   let igstVal = 0;
  //   let cgstVal = 0;
  //   let sgstVal = 0;
  //   this.popupData = d
  //   console.log("pop====.>", this.popupData);
  //   this.popupData.forEach(x => {
  //     console.log(x.total);
  //     total += x.total;
  //     this.x = (x.cgst == 0) ? true : false;
  //     this.y = (x.sgst == 0) ? true : false;
  //     this.z = (x.igst == 0) ? true : false;
  //     cgstVal = gst_rev(x.total, x.cgst);
  //     sgstVal = gst_rev(x.total, x.sgst);
  //     igstVal = gst_rev(x.total, x.igst);
  //     x.igstVal = igstVal;
  //     x.sgstVal = sgstVal;
  //     x.cgstVal = cgstVal;
  //   });
  //   this.popupData.totalData = total;

  //   console.log(this.popupData.total);
  //   console.log(this.popupData);

  //   this.modal = true

  // }
  back() {
    console.log('hii');
    this.purchase_tab = false;
  }

    // invoice popup open
    openInvoice = (content, ino) =>{
      this.router.navigate(['/v2/Erpmain/trade/invoice']);
    }
    // invoice popup close
    closeInvoice(content) {
      this.modalService.dismissAll(content);
    }
    // print invoice
    printInvoice = () =>{
      window.print();
      console.log('hi');
      this.closeInvoice('content');

    }
}

function gst_rev(original_price: any, gst: any) {
  return parseFloat((original_price - (original_price * (100 / (100 + gst)))).toFixed(2))
}
