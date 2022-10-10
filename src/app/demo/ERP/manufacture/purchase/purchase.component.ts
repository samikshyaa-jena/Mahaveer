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
  item_name: any = [];
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
  updatePurchase: FormGroup;
  updateData: any;
  invoiceNo: any;
  vendData: any;
  enable: boolean = false;
  purchase_dataArray: any[];
  gi: any;
  productname: any;
  dummy: any =  [];
  cattName: any;
  itemmName: any;
  catt_id: any;
  itemm_id: any;
  debitNoteForm: FormGroup;
  vend_id: any;
  filterdItem: any = [];
  debitIgst: any;
  debitCgst: any;
  debitSgst: any;
  debitPrice: any;
  debit_invoice_no: any;
  returnData: any =   [];
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
      mode: new FormControl("manufcture")
    });
    this.updatePurchase = new FormGroup({
      category: new FormControl(this.cattName),
      item_id: new FormControl(""),
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
    this.debitNoteForm = new FormGroup({
      vendor_id: new FormControl(this.cattName),
      type: new FormControl(""),
      date: new FormControl(""),
      item_id: new FormControl("selectItem"),
      qty: new FormControl(""),
      prc: new FormControl(""),
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

  changeType = (e) => {
    console.log(e);
    if (e == 'trade') {
      this.router.navigate(["/v2/Erpmain/trade/purchase"])
    }
  }

  get_Category = () => {
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.getCategory).pipe(finalize(() => { this.loader = false; })).subscribe(
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
  calc_total() {
    let prc=(this.updatePurchase.get('price').value).toFixed(2);
    let qt=this.updatePurchase.get('qty').value;
    let discnt=this.updatePurchase.get('discount').value;
    let igst = (this.updatePurchase.get('igst').value).toFixed(2);
    let sgst =(this.updatePurchase.get('sgst').value).toFixed(2);
    let cgst = (this.updatePurchase.get('cgst').value).toFixed(2);
    let total = 0;
    let gstTotal = (igst + cgst + sgst)/100;
    let sum = 0;
    sum = qt*prc
    total = ((sum*gstTotal) + sum)-discnt;
    this.updatePurchase.patchValue({
       total:(total).toFixed(2)
    })
  }

  get_Vendor = () => {
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.get_Vendor).pipe(finalize(() => { this.loader = false; })).subscribe(
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
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.get_Item).pipe(finalize(() => { this.loader = false; })).subscribe(
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
    console.log(this.getCategoryData);
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
    this.ErpService.get_Reqs(erp_all_api.urls.purchase_entry).pipe(finalize(() => { })).subscribe(
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
        console.log(this.get_purchase_data);

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
            console.log("totalIgst==>", totalIgst[i], "totalCgst==>", totalCgst[i], "totalSgst==>", totalSgst[i]);

            totalIgst[i] = (totalIgst[i] == 0) ? "NA" : (totalIgst[i]).toFixed(2) //+ " %";
            totalCgst[i] = (totalCgst[i] == 0) ? "NA" : (totalCgst[i]).toFixed(2) //+ " %";
            totalSgst[i] = (totalSgst[i] == 0) ? "NA" : (totalSgst[i]).toFixed(2) //+ " %";
            console.log("totalIgst==>", totalIgst[i], "totalCgst==>", totalCgst[i], "totalSgst==>", totalSgst[i]);

            this.get_purchase_data[i].totalsum = (totaldata[i]).toFixed(2);
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
    this.ErpService.post_Reqs(erp_all_api.urls.purchase_entry, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res, "get item");
        Notiflix.Report.success(res.msg, '', 'Close');
        this.get_purchase_details();
        this.purchase_tab = false;
        this.dynamicManufacture.reset();
        this.purchase_form.reset();
        this.back();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });

  };
  // gst
  getGst(e){
     console.log("kkkkk",e);
     console.log(this.filterdItem);
     
     for (let i = 0; i < this.filterdItem.length; i++) {
      console.log(this.filterdItem[i].item_id);
       if (this.filterdItem[i].item_id == e) {
         console.log("hi");
         this.debitIgst = this.filterdItem[i].igst;
         this.debitCgst = this.filterdItem[i].cgst;
         this.debitSgst = this.filterdItem[i].sgst;
         this.debitPrice = this.filterdItem[i].purchase_price
       }       
     }
     console.log(this.debitSgst,this.debitIgst,this.debitCgst,this.debitPrice);
     this.debitNoteForm.patchValue({
      igst: this.debitIgst,
      cgst: this.debitCgst,
      sgst: this.debitSgst,
      prc: this.debitPrice,
      total: 0
    })
  }

  
  calc_debit_price() {
    let prc=this.debitNoteForm.get('prc').value;
    let qt=this.debitNoteForm.get('qty').value;
    let igst = this.debitNoteForm.get('igst').value;
    let sgst =this.debitNoteForm.get('sgst').value;
    let cgst = this.debitNoteForm.get('cgst').value;
    let total = 0;
    let gstTotal = (igst + sgst + cgst)/100;
    let sum = 0;
    sum = qt*prc
    total = ((sum*gstTotal) + sum);
    this.debitNoteForm.patchValue({
       total:total
    })
  }


  debitNote(i,d,v,debit){
    console.log(i,d,v);
    this.debit_invoice_no = i;
    console.log(v.vendor_id);
    this.vend_id = v.vendor_id;
    this.modalService.open(debit);

    for (let i = 0; i < d.length; i++) {
      if (d[i].delete_stat == 0) {
        this.filterdItem.push(d[i]);
      }
    }
    console.log(this.filterdItem);
    this.debitNoteForm.patchValue({
      vendor_id: v.name,
      type: "raw material",
    })
  }
  closeDebitForm = (debit) => {
    this.modalService.dismissAll(debit);
  }
  update_debit_note = () =>{
    let return_Data={
      item_id:this.debitNoteForm.get('item_id').value,
      igst:this.debitNoteForm.get('igst').value,
      cgst: this.debitNoteForm.get('cgst').value,
      sgst: this.debitNoteForm.get('sgst').value,
      qty: this.debitNoteForm.get('qty').value,
      total: this.debitNoteForm.get('total').value,
    }
    console.log(return_Data);
    
    this.returnData.push(return_Data)
    console.log(this.returnData);
    
    this.loader = true;
        

    const reqBody = {
      "invoice": this.debit_invoice_no,
      "vendor_id": this.vend_id,
      "type": this.debitNoteForm.get('type').value,
      "date": this.debitNoteForm.get('date').value,
      "returnData": this.returnData
  }
    this.ErpService.post_Reqs(erp_all_api.urls.debit_note, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res,"debit note res");
        this.debitNoteForm.reset();
        this.closeDebitForm('debit');
        Notiflix.Notify.success(res.msg)
        
      },
      (err: any) => {
        console.log(err,"debit note err");
        this.debitNoteForm.reset();
        this.closeDebitForm('debit');
        Notiflix.Notify.failure(err.error.msg+ "Product");
      });
  }

  openUpdateProductPage = (i)=>{
    this.purchase_tab = true;
    this.purchase_tab2 = this.get_purchase_data[i];
  }


  updateArray = () => {
    console.log(this.updatePurchase.value);
    this.popupData[this.gi] = this.updatePurchase.value;
    this.popupData[this.gi].catagory = this.catt_id;
    this.popupData[this.gi].item_id = this.itemm_id;
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
    for (let i = 0; i < this.updateData.length; i++) {
      let cgstBarri = this.updateData[i].cgst;
      let igstBarri = this.updateData[i].igst;
      let sgstBarri = this.updateData[i].sgst;
      let priceBarri = this.updateData[i].price;
      let qtyBarri = this.updateData[i].qty;
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
    this.cattName = this.updateData[i].catagoryName;
    this.catt_id = this.updateData[i].catagory;
    this.itemmName = this.updateData[i].itemName;
    this.itemm_id = this.updateData[i].item_id;
    console.log(this.cattName,this.itemmName,this.catt_id,this.itemm_id);
    console.log(this.itemmName);
    this.updatePurchase.patchValue({
      category: this.cattName,
      item_id: this.itemmName,
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

  update_purchase_details = () => {
    this.loader = true;
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const reqBody = {
      "invoice": this.invoiceNo,
      "vendor_id": this.vendData.vendor_id,
      "type": this.vendData.type,
      "date": date,
      "purchase_data": this.purchase_dataArray
    }
    this.ErpService.post_Reqs(erp_all_api.urls.update_purchase_entry, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
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


  closeUpdateForm = (updt) => {
    this.modalService.dismissAll(updt);
  }


  back() {
    console.log('hii');
    this.purchase_tab = false;
  }
}

function gst_rev(original_price: any, gst: any) {
  return parseFloat((original_price - (original_price * (100 / (100 + gst)))).toFixed(2))
}
