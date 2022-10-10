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
import { DatePipe } from '@angular/common';

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
  getCategoryData: any = [];
  itemList: any;
  cat_id: any;
  hsn: any;
  cat_data: any;
  itemData: any;
  Item_name: any;
  formArrayValue: any;
  invoice: boolean;
  modal1: boolean = false;
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
  dummy: any = [];
  customerSelectedId: any;
  cattName: any;
  proddName: any;
  catt_id: any;
  prodd_id: any;
  modal3: boolean;
  t_igst: number;
  t_sgst: number;
  t_cgst: number;
  t_amount: number;
  itemname: any;
  type: any;
  p_array: any = [];
  itemData2: any = [];
  prodData_id: any = [];
  productformarray: any = [];
  pdf: boolean = false;
  pdfData: any;

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
    this.updatePurchase = new FormGroup({
      "product": new FormArray([
      ])
    })

    this.purchase_form = new FormGroup({
      invo: new FormControl("", [Validators.required]),
      custmer_id: new FormControl(""),
      custmer: new FormControl("", [Validators.required]),
      p_date: new FormControl("", [Validators.required]),
      amnt: new FormControl("0", [Validators.required]),
      payMode: new FormControl("choosepaymode", [Validators.required]),
      payStatus: new FormControl("choosepay", [Validators.required]),
    });

    this.dynamicManufacture = this.fb.group({
      manufacture: this.fb.array([])
    });
  }

  ngOnInit() {
    this.get_Category();
    this.get_Item();
    this.get_Vendor();
    this.get_purchase_details();
  }

  get_Category = () => {
    this.ErpService.get_Reqs(erp_all_api.urls.getProduct).pipe(finalize(() => { })).subscribe(
      (res: any) => {
        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0) {
            this.itemData2.push(catData[i]);
            this.prodData_id.push(catData[i].prod_id);
          }
        }
        console.log(this.itemData2);
      },
      (err: any) => {
        console.log(err);
      });
  };


  get_Item = () => {
    this.ErpService.get_Reqs(erp_all_api.urls.get_prod).pipe(finalize(() => { })).subscribe(
      (res: any) => {
        console.log(res, "get item");

        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0 && !(this.prodData_id.includes(catData[i].prod_id))) {
            this.itemData2.push(catData[i]);
          }
        }
        console.log(this.itemData2);

        console.log(this.item_name);
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
    this.ErpService.get_Reqs(erp_all_api.urls.get_cust).pipe(finalize(() => { })).subscribe(
      (res: any) => {
        console.log(res);
        this.vendor_data = res
        console.log(this.vendor_data);
      },
      (err: any) => {
        console.log(err);
      });

  };

  updateArray = () => {
    console.log(this.updatePurchase.value);
    this.popupData[this.gi] = this.updatePurchase.value;
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

  openUpdatePucrchase = (i, d, updt) => {
    this.gi = i
    this.open_modal2();
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
      priceBarri = priceBarri * qtyBarri;
      igstVal = (igstBarri / 100) * priceBarri;
      sgstVal = (sgstBarri / 100) * priceBarri;
      cgstVal = (cgstBarri / 100) * priceBarri;
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
      category: this.cattName,
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
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.trd_get_sale_entry).pipe(finalize(() => { this.loader = false; })).subscribe(
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
    debugger;
    this.loader = true;
    console.log(this.purchase_data[0].price);
    const reqBody = {
      "invoice": this.purchase_form.get('invo').value,
      "vendor_id": this.purchase_form.get('vendor').value,
      "type": 'rawmaterial',
      "purchase_data": this.purchase_data[0],
      "date": this.purchase_form.get('p_date').value
    }
    this.ErpService.post_Reqs(erp_all_api.urls.trd_sale_entry, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
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

  invoicenumberPopup(saledata, index) {
    console.log(saledata);
    this.type = saledata.customerData.type;
    this.purchase_form.patchValue({
      invo: saledata.invoice_no,
      custmer_id: saledata.customerData.customer_id,
      custmer: saledata.customerData.name,
      p_date: this.datePipe.transform(saledata.sell_date, 'yyyy-MM-dd'),
      amnt: 0,
      payMode: saledata.method,
      payStatus: saledata.payment_status
    });
    console.log(index);
    this.invoiceTabopen();
    var p_form = this.updatePurchase.get('product')['controls'];
    for (let i = 0; i < saledata.sellData.length; i++) {
      if (saledata.sellData[i]) {
        this.add_row();
      p_form[i].patchValue({
        prud: saledata.sellData[i].prod_id,
        igst: saledata.sellData[i].igst,
        cgst: saledata.sellData[i].cgst,
        sgst: saledata.sellData[i].sgst,
        hsn: saledata.sellData[i].hsn,
        price: saledata.sellData[i].price,
        qty: saledata.sellData[i].quantity,
        discount: saledata.sellData[i].discount,
        total: saledata.sellData[i].total,
      });
      }

    }
    this.totalCalculation();
  }

  back() {
    this.purchase_tab = false;
    this.get_purchase_details();
  }

  generateInvoice = (e: any) => {
    console.log(this.get_purchase_data);
    this.pdfData = this.get_purchase_data.filter((x) => {
      return x.invoice_no == e;
    });
    console.log(this.pdfData);
    this.pdf = true;
  }
  hidePdf = (e: any) => {
    if (e) {
      this.pdf = false;
    }

  }

  // invoice popup open
  openInvoice = (content, ino) => {
    this.router.navigate(['/v2/Erpmain/trade/invoice']);
  }
  // invoice popup close
  closeInvoice(content) {
    this.modalService.dismissAll(content);
  }
  // print invoice
  printInvoice = () => {
    window.print();
    console.log('hi');
    this.closeInvoice('content');

  }

  prevent(e, type) {
    console.log(e);

    if (type == 'qty') {
      if (e.target.value > 0) {
        return e.keyCode >= 48 && e.charCode <= 57;
      } else {
        return e.keyCode > 48 && e.charCode <= 57;
      }
    }
    else if (type == 'dis' || type == 'prc') {
      return e.keyCode >= 48 && e.charCode <= 57;
    }
  }

  open_modal2() {
    this.modal3 = true;
  }
  closeUpdateForm() {
    this.modal3 = false;
  }
  invoiceTabopen() {
    this.purchase_tab = false;
    this.invoice = true;
  }
  invoiceTabclose() {
    this.purchase_tab = false;
    this.invoice = false;
    this.get_purchase_details();
  }

  productdata(): FormGroup {
    return this.fb.group({
      prud: new FormControl('ChooseProduct', [Validators.required]),
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
    (<FormArray>this.updatePurchase.get('product')).push(this.productdata())
  }
  add_row2() {
    (<FormArray>this.updatePurchase.get('product')).push(this.productdata())

    var p_form = this.updatePurchase.get('product')['controls'];
    var l: number = (p_form.length) - 1;
    console.log(l);

    p_form[l].controls.edit.patchValue(true);
  }
  deleteRow(i) {
    (<FormArray>this.updatePurchase.get('product')).removeAt(i)
  }

  chooseProduct(form_cont, item) {

    form_cont.patchValue({
      discount: 0,
      qty: 1,
    });

    console.log(item);
    console.log(form_cont);
    console.log(this.purchase_form);
    console.log(this.itemData2);

    let hsn: number;
    let gst: number;
    let GST: number;
    let gstvalue: number;
    let mrp: number;

    for (let i = 0; i < this.itemData2.length; i++) {
      if (this.itemData2[i].prod_id == item) {
        GST = parseInt(this.itemData2[i].gst);
        hsn = this.itemData2[i].hsn;

        if (this.itemData2[i].mrp) {
          mrp = this.itemData2[i].mrp;
          gst = mrp * (GST / 100);
        } else {
          mrp = this.itemData2[i].price;
          gst = mrp * (GST / 100);
        }
        this.itemname = this.itemData2[i].prod_name;

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

    this.calc_total(form_cont.controls);
  }

  calc_total(form_cont) {

    let prc: number = form_cont.price.value;
    let qt: number = form_cont.qty.value;
    let discnt: number = form_cont.discount.value;
    let item = form_cont.prud.value;

    let gst: number;
    let GST: number;
    let igst: number;
    let sgst: number;
    let cgst: number;

    for (let i = 0; i < this.itemData2.length; i++) {
      if (this.itemData2[i].prod_id == item) {

        GST = parseInt(this.itemData2[i].gst);
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

  totalCalculation() {
    var pform = this.updatePurchase.get('product')['controls'];
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

  resetProductForm() {
    var p_form = this.updatePurchase.get('product')['controls'];
    console.log(p_form);
    p_form.splice(0, p_form.length);
    console.log(p_form);
    this.totalCalculation()
  }

  update_purchase_details = () => {

    this.productformarray = [];
    var p_form = this.updatePurchase.get('product')['controls'];
    console.log(p_form);

    for (let i = 0; i < p_form.length; i++) {
      console.log(p_form[i].value);
      this.productformarray.push(p_form[i].value)
    }

    if (this.productformarray) {

      var product_arr = this.productformarray.map((p_array) => {
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
    console.log(this.purchase_form.get('invo').value,);
    console.log(this.productformarray);
    const reqBody = {
      "invoice": this.purchase_form.get('invo').value,
      "customer_id": this.purchase_form.get('custmer_id').value,
      "date": this.datePipe.transform(this.purchase_form.get('p_date').value, 'yyyy-MM-dd'),
      "sell_data": product_arr,
      "payment_status": this.purchase_form.get('payStatus').value,
      "method": this.purchase_form.get('payMode').value,
      "paid_amount": this.purchase_form.get('amnt').value

    }
    this.ErpService.post_Reqs(erp_all_api.urls.trd_updt_sale_entry, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success('SuccessFully Added', '', 'Close');
        console.log(res, "get item");
        this.purchase_form.reset();
        this.invoiceTabclose();
      },
      (err: any) => {
        console.log(err);
        console.log(err.error.msg);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };
}

function gst_rev(original_price: any, gst: any) {
  return parseFloat((original_price - (original_price * (100 / (100 + gst)))).toFixed(2))
}
