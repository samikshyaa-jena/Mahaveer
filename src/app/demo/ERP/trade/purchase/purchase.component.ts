import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../erp-service.service';
import { erp_all_api } from '../../erpAllApi';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  purchase_form: FormGroup;
  vendor_data: any;
  vendor_name: any = [];
  item_data: any;
  prod_name: any = [];
  dynamicManufacture: FormGroup;
  total_value: any = [];
  get_purchase_data: any = [];
  total_value1: number;
  purchase_data: any;
  purchase_tab: boolean;
  gstVal: any;
  control: FormGroup; 
  getCategoryData: any;
  itemList: any;
  cat_id: any;
  hsn: any;
  cat_data: any;
  itemData: any;
  Item_name: any;
  formArrayValue: any;
  modal: boolean;
  popupData: any = [];
  x: boolean;
  y: boolean;
  z: boolean;
  loader: boolean;
  modeForm: FormGroup;
  updateModal: boolean;
  updatePurchase: FormGroup;
  updateData: any;
  gi: any;
  productname: any;
  purchase_dataArray: any[];
  enable: boolean;
  invoiceNo: any;
  vendData: any;
  dummy: any = [];
  cattName: any;
  itemmName: any;
  catt_id: any;
  itemm_id: any;
  purchase_tab2: any = [];

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { 
    this.purchase_form = new FormGroup({
      invo: new FormControl("", [Validators.required]),
      vendor: new FormControl("", [Validators.required]),
      p_date: new FormControl("", [Validators.required]),


    });
    this.dynamicManufacture = this.fb.group({
      manufacture: this.fb.array([])
    });

    this.modeForm = new FormGroup({
      mode: new FormControl("trade")
    });

    this.updatePurchase = new FormGroup({
      category: new FormControl(""),
      prod_id: new FormControl(""),
      hsn: new FormControl(""),
      price: new FormControl(""),
      qty: new FormControl(""),
      unit: new FormControl(""),
      discount: new FormControl(""),
      cgst: new FormControl(""),
      sgst: new FormControl(""),
      igst: new FormControl(""),
      total: new FormControl(""),
    });
   }

   ngOnInit() {
    this.get_Category();
    this.get_Vendor();
    this.get_Item();
    this.get_purchase_details();


  }


  // edit starts


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

  updateArray = () => {
    console.log(this.updatePurchase.value);
    this.popupData[this.gi] = this.updatePurchase.value;
    this.popupData[this.gi].category = this.catt_id;
    this.popupData[this.gi].prod_id = this.itemm_id;
    console.log(this.popupData, "hhhhhhhhhhhhhhh");
    for (let i = 0; i < this.popupData.length; i++) {
      this.purchase_dataArray[i] = this.popupData[i];
    }
    this.enable = true;
    console.log(this.updatePurchase.value);
    this.modalService.dismissAll('updt');
    this.purchase_dataArray = this.purchase_dataArray.filter((el) => {
      return el != null;
    });
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
    this.updateData.forEach(x => {
      console.log(x.total);
      total += x.total;
      this.x = (x.cgst == 0) ? true : false;
      this.y = (x.sgst == 0) ? true : false;
      this.z = (x.igst == 0) ? true : false;
      cgstVal = gst_rev(x.total, x.cgst);
      sgstVal = gst_rev(x.total, x.sgst);
      igstVal = gst_rev(x.total, x.igst);
      x.igstVal = igstVal;
      x.sgstVal = sgstVal;
      x.cgstVal = cgstVal;
    });
    this.updateData.totalData = total;
    console.log(this.updateData.total);
    console.log(this.updateData);
    this.cattName = this.updateData[i].categoryName;
    this.catt_id = this.updateData[i].category;
    this.itemmName = this.updateData[i].itemName;
    this.itemm_id = this.updateData[i].prod_id;
    console.log(this.cattName,this.itemmName,this.catt_id,this.itemm_id);

    this.updatePurchase.patchValue({
      category: this.cattName,
      prod_id: this.itemmName,
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


  // openUpdatePucrchase = (d,updt) => {
  //   this.modalService.open(updt);
  //   let total = 0;
  //   let igstVal = 0;
  //   let cgstVal = 0;
  //   let sgstVal = 0;
  //   this.updateData = d
  //   console.log("pop====.>", this.updateData);
  //   this.updateData.forEach(x => {
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
  //   this.updateData.totalData = total;
  //   console.log(this.updateData.total);
  //   console.log(this.updateData);
  //   this.updateModal = true;
  //   this.updatePurchase.patchValue({
  //     category: this.updateData[0].cat_name,
  //     product: this.updateData[0].prod_name,
  //     hsn: this.updateData[0].hsn,
  //     purPrice: this.updateData[0].purchase_price,
  //     quantity: this.updateData[0].quantity,
  //     unit: this.updateData[0].unit,
  //     discount: this.updateData[0].discount,
  //     cgst: this.updateData[0].cgstVal,
  //     sgst: this.updateData[0].sgstVal,
  //     igst: this.updateData[0].igstVal,
  //     total: this.updateData[0].total,
  //   });
  // };

  update_purchase_details = () => {
    this.loader = true;
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // console.log(this.purchase_data[0].price);
    const reqBody = {
      "invoice": this.invoiceNo,
      "vendor_id": this.vendData.vendor_id,
      "type": this.vendData.type,
      "date": date,
      "purchase_data": this.purchase_dataArray
    }

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.trd_update_purchase_entry, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res, "get update_purchase_entry");
        Notiflix.Report.success(res.msg, '', 'Close');
        this.modal = false;
        this.get_purchase_details();
        // this.get_purchase_details();
        // this.purchase_tab = false;
        // this.dynamicManufacture.reset();
        // this.purchase_form.reset();
        // this.purchase_form.reset();
        // this.purchase_tab = false;
        // this.back();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });

  };
  // edit ends

  changeType = (e)=>{
    console.log(e);
    if (e == 'manufcture') {
      // this.router.navigate(["/v2/Erpmain/category"])
      this.router.navigate(["/v2/Erpmain/purchaseMod/purchase"])
    }
  }

  get_Category = () => {

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.getTradeCat).pipe(finalize(() => { })).subscribe(
      (res: any) => {
        this.getCategoryData = res.data;
        console.log("response is", this.getCategoryData);
        console.log("resps", Object.values(this.getCategoryData));
      },
      (err: any) => {
        console.log(err);
      });
  };

  purchase_entry = () => {
    this.purchase_tab = true;
    this.purchase_tab2 = null;
  }
  back_table = () => {
    this.purchase_tab = false;
    this.dynamicManufacture.reset();
    this.purchase_form.reset();
  }
  openUpdateProductPage = (i)=>{
    this.purchase_tab = true;
    this.purchase_tab2 = this.get_purchase_data[i];
  }

  get UserFormGroups() {
    return this.dynamicManufacture.get('manufacture') as FormArray
  }
  add_more_item() {
    this.control = new FormGroup({
      'cat_name': new FormControl(null),
      'prod_id': new FormControl(null),
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

  // calc_total(i) {
  //   console.log(i);
  //   let form_object = this.dynamicManufacture.value
  //   console.log(form_object);
  //   this.purchase_data = (Object.values(form_object));
  //   let formArrayValue = form_object.manufacture[i]
  //   console.log(formArrayValue);

  //   let prc = form_object.manufacture[i].price;
  //   console.log(prc);

  //   let qt = form_object.manufacture[i].qty;
  //   let discnt = form_object.manufacture[i].discount
  //   if (qt != null) {
  //     if (discnt != null) {
  //       let amnt = prc * qt;
  //       this.total_value[i] = ((((amnt * this.gstVal) / 100) + amnt) - (discnt));
  //       formArrayValue.total = this.total_value[i];
  //       console.log(amnt);

  //     }
  //     else {
  //       let amnt = prc * qt;
  //       this.total_value[i] = ((((amnt * this.gstVal) / 100) + amnt) - (0));
  //       formArrayValue.total = this.total_value[i];
  //       console.log(amnt);

  //     }
  //   } else if (discnt != null) {
  //     let amnt = prc * 1;
  //     this.total_value[i] = ((((amnt * this.gstVal) / 100) + amnt) - (discnt));
  //     formArrayValue.total = this.total_value[i];
  //     console.log(amnt);

  //   } else {
  //     let amnt = prc * 1;
  //     console.log(amnt);

  //     this.total_value[i] = ((((amnt * this.gstVal) / 100) + amnt) - (0));
  //     formArrayValue.total = this.total_value[i];
  //   }
  //   formArrayValue.total = this.total_value[i];
  // }

  get_Vendor = () => {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_trd_vendor).pipe(finalize(() => { this.loader = false; })).subscribe(
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

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_prod).pipe(finalize(() => { })).subscribe(
      (res: any) => {
        console.log(res, "get item");

        this.item_data = res.data.map((val) => {
          return { prod_name: val.prod_name, prod_id: val.prod_id, gst: val.gst };
        });
        console.log(this.item_data);
        for (let i = 0; i < this.item_data.length; i++) {
          this.prod_name[i] = this.item_data[i].prod_name;
        }
        console.log(this.prod_name);
      },
      (err: any) => {
        console.log(err);

      });

  };



  item_list = (e) => {
    for (let i = 0; i < this.getCategoryData.length; i++) {
      if (this.getCategoryData[i].cat_id == e) {
        this.itemData = this.getCategoryData[i].itemData;
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
      if (element.prod_id == e) {
        this.gstVal = element.gst
        this.hsn = element.hsn
        this.Item_name = element.prod_name
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

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.trd_get_purchase_entry).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);

        this.get_purchase_data = res.data;
        let haji = [];
        let sahin = 0;
        for (let i = 0; i < this.get_purchase_data.length; i++) {
          haji = this.get_purchase_data[i].purchase_data;
          for (let j = 0; j < haji.length; j++) {
            if (haji[j].delete_stat == 0) {
              sahin = sahin + haji[j].total;
            }
          }
          this.get_purchase_data[i].totalPrice = sahin;
        }
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
          purchase_data = this.get_purchase_data[i].purchase_data
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

  add_purchase_details = () => {
    this.loader = true;
    console.log(this.purchase_data[0].price);
    const reqBody = {
      "invoice": this.purchase_form.get('invo').value,
      "vendor_id": this.purchase_form.get('vendor').value,
      "type": 'rawmaterial',
      "purchase_data": this.purchase_data[0],
      "date": this.purchase_form.get('p_date').value
    }

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.purchase_entry, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
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


  closeUpdateForm = (updt) =>{
    this.modalService.dismissAll(updt);
  }

  // updtPur = () =>{
  //   this.loader = true;
  //   console.log(this.purchase_data[0].price);
  //   const reqBody = {
  //     "invoice": this.purchase_form.get('invo').value,
  //     "vendor_id": this.purchase_form.get('vendor').value,
  //     "type": 'rawmaterial',
  //     "purchase_data": this.purchase_data[0],
  //     "date": this.purchase_form.get('p_date').value
  //   }

  //   let auth_token = sessionStorage.getItem('CORE_SESSION');
  //   let headers = new HttpHeaders();
  //   headers = headers.set('auth-token', auth_token);

  //   this.ErpService.post_Reqs(erp_all_api.urls.purchase_entry, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
  //     (res: any) => {
  //       console.log(res, "get item");
  //       Notiflix.Report.success(res.msg, '', 'Close');
  //       this.get_purchase_details();
  //       this.purchase_tab = false;
  //       this.dynamicManufacture.reset();
  //       this.purchase_form.reset();
  //       this.purchase_form.reset();
  //       this.purchase_tab = false;
  //       this.back();
  //     },
  //     (err: any) => {
  //       console.log(err);
  //       Notiflix.Report.failure(err.error.msg, '', 'Close');
  //     });
  // }


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

  //   this.modal = true;
  // }
  invoicenumberPopup(i, d, v) {
    console.log(v, "vendor data................");
    this.vendData = v;
    this.purchase_dataArray = [];
    console.log(i);
    this.invoiceNo = i;

    let total = 0;
    let igstVal = 0;
    let cgstVal = 0;
    let sgstVal = 0;
    this.dummy = [
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
      {
        category: '',
        categoryName: '',
        prod_id: '',
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
      },
    ];
    this.popupData = d;
    console.log("pop====.>", this.popupData);
    for (let i = 0; i < this.popupData.length; i++) {
      let cgstBarri = this.popupData[i].cgst;
      let igstBarri = this.popupData[i].igst;
      let sgstBarri = this.popupData[i].sgst;
      let priceBarri = this.popupData[i].purchase_price;
      let qtyBarri = this.popupData[i].quantity;
      priceBarri = priceBarri*qtyBarri;
      igstVal = (igstBarri/100)*priceBarri;
      sgstVal = (sgstBarri/100)*priceBarri;
      cgstVal = (cgstBarri/100)*priceBarri;
      this.popupData[i].igstVal = igstVal;
      this.popupData[i].sgstVal = sgstVal;
      this.popupData[i].cgstVal = cgstVal;
    }
    // this.popupData.forEach(x => {
    //   console.log(x.total);
    //   total += x.total;
    //   this.x = (x.cgst == 0) ? true : false;
    //   this.y = (x.sgst == 0) ? true : false;
    //   this.z = (x.igst == 0) ? true : false;
    //   cgstVal = gst_rev(x.total, x.cgst);
    //   sgstVal = gst_rev(x.total, x.sgst);
    //   igstVal = gst_rev(x.total, x.igst);
    //   x.igstVal = igstVal;
    //   x.sgstVal = sgstVal;
    //   x.cgstVal = cgstVal;
    // });
    this.popupData.totalData = total;

    console.log(this.popupData.total);
    console.log(this.popupData);
    let allData = this.popupData;
    this.popupData = [];
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].delete_stat == 0) {
        this.popupData.push(allData[i]);
      }
    }
    console.log(this.popupData);
    this.modal = true;
    this.loader = true;
    for (let l = 0; l < this.popupData.length; l++) {
      this.dummy[l].category = this.popupData[l].cat_id;
      this.dummy[l].categoryName = this.popupData[l].cat_name;
      this.dummy[l].prod_id = this.popupData[l].prod_id;
      this.dummy[l].itemName = this.popupData[l].prod_name;
      this.dummy[l].hsn = this.popupData[l].hsn;
      this.dummy[l].price = this.popupData[l].purchase_price;
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
    }

    this.dummy =  this.dummy.filter((el) => {
      return el.category !=  '';
    });
    console.log(this.dummy);
    this.popupData = this.dummy;
    console.log(this.popupData);
    // this.cattName = this.popupData[i].categoryName;
    // this.catt_id = this.popupData[i].category;
    // this.itemmName = this.popupData[i].itemName;
    // this.itemm_id = this.popupData[i].item_id;
    // console.log(this.cattName,this.itemmName,this.catt_id,this.itemm_id);
    this.loader = false;
  }

  back() {
    console.log('hii');
    this.purchase_tab = false;
  }
}

function gst_rev(original_price: any, gst: any) {
  return parseFloat((original_price - (original_price * (100 / (100 + gst)))).toFixed(2))
}
