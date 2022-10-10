import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../../erp-service.service';
import { erp_all_api } from '../../../erpAllApi';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss']
})
export class DebitNoteComponent implements OnInit {
  monthList: any = [];
  filterForm: FormGroup;
  firmList: any[];
  td: string[];
  debitNote: boolean = true;
  debitNoteForm: FormGroup;
  modeForm: FormGroup;
  cattName: any;
  userForm: FormGroup;
  adduserForm: FormGroup;
  control: FormGroup;
  userformnumber: []
  vendor_data: any;
  manufacture_data: any;
  manufacture_data2: any;
  manufacture_data_length: any;
  loader: boolean;

  srh_date: any;
  srh_date2: any;
  search_date_array: any;
  fateRange: any;
  fateRange1: any;
  search_month_array: any;
  item_data: any;
  invoiceNoArr: any = [];
  invo_data: any = [];
  inv: boolean = false;
  debitData: any;
  adduserformArray: any[]
  t_gst: number;
  t_amount: number;

  constructor(
    private fb: FormBuilder,
    private ErpService: ErpServiceService,
    private datePipe: DatePipe,
  ) {

    this.userForm = new FormGroup({
      "vender": new FormControl(''),
      "invo_date": new FormControl(''),
      "invoiceNo": new FormControl('Invoice Number'),
    });

    this.adduserForm = new FormGroup({
      "user": new FormArray([

      ])
    })

    this.modeForm = new FormGroup({
      mode: new FormControl("manufcture")
    });
    this.filterForm = new FormGroup({
      month: new FormControl('Choose Month', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      firm: new FormControl('Choose Firm', [Validators.required])
    });
    this.debitNoteForm = new FormGroup({
      invo: new FormControl(this.cattName),
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

    this.getcategory();
    this.getVender();
    this.getItem();
    this.add_row();
    this.getInvoiceNo();
    this.getDebitData();

    this.monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.firmList = ['abc', 'xyz', 'pqr'];
    this.td = ['1', '2', '3'];
  }

  getInvoiceNo() {
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.getInvoiceNo).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res.data);
        let data = res.data;
        this.invoiceNoArr = data.filter((x:any)=>{
          if (x.c != "trade") {
            return x;
          }
        });
        console.log(this.invoiceNoArr);
        
      },
      (err: any) => {
        console.log(err);
      });
  }
  chooseInvoice = () =>{
    this.inv = true;
    let inv = this.userForm.get('invoiceNo').value;
    this.invo_data = this.invoiceNoArr.filter((x:any)=>{
      if (x.invoice_no == inv) {
        return x;
      }
    });
    console.log(this.invo_data);
    let dt = this.datePipe.transform(this.invo_data[0].purchase_date,'dd-MM-yyyy');
    console.log(dt);
    
    this.userForm.patchValue({
      vender: this.invo_data[0].vendorData.name,
      invo_date: dt
    });
  }

  getcategory() {
    this.loader = true;
    const cat_body = {
      "type": "rawmaterial"
    };

    this.ErpService.post_Reqs(erp_all_api.urls.getCatogory, cat_body).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);
        this.manufacture_data = res.data[0].ReturnData;
        this.manufacture_data2 = res.data[0].ReturnData;
        this.manufacture_data = this.manufacture_data.map((x) => {
          return {
            item_name: x.item_name,
            return_date: this.datePipe.transform(x.return_date, 'dd MMM y')
          }
        });
        this.sortTable('return_date');
        console.log(this.manufacture_data);
      },
      (err: any) => {
        console.log(err);

      });

  }

  getVender() {
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.get_Vendor).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);
        this.vendor_data = res.data
        console.log(this.vendor_data);
      },
      (err: any) => {
        console.log(err);

      });

  }

  getItem() {
    this.loader = true;
    this.ErpService.get_Reqs(erp_all_api.urls.get_Item).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);
        this.item_data = res.data;
        console.log(this.item_data);

      },
      (err: any) => {
        console.log(err);

      });

  }
  getDebitData() {
    this.loader = true;
    const reqBody = {
      "type":"raw material"
    }

    this.ErpService.post_Reqs(erp_all_api.urls.debitData,reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);
        let data = res.data;
        console.log(data);
        this.debitData = data.map((x:any)=>{
          return {
            invoNo: x.invoice_no,
            date: this.datePipe.transform(x.return_date,'dd-MM-yyyy'),
            vendData: x.vendorData,
            returnData: x.ReturnData,
            gstn: x.vendorData.gstn,
            name: x.vendorData.name,
            type: x.vendorData.type,
            vend_id: x.vendorData.id
          }
        });
        console.log(this.debitData);
        
        
      },
      (err: any) => {
        console.log(err);
      });

  }

  sortTable(colName: any) {
    this.manufacture_data.sort((a, b) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return b.localeCompare(a);
    });
  }


  toggleDiv = (e) => {
    if (e == 1) {
      this.debitNote = false;
    } else {
      this.debitNote = true;
    }
  }
  userinfo(): FormGroup {
    return this.fb.group({

      "item": new FormControl('ch_item', [Validators.required]),
      "model_no": new FormControl(''),
      "hsn": new FormControl('', [Validators.required]),
      "quantity": new FormControl('', [Validators.required]),
      "unit": new FormControl('None', [Validators.required]),
      "price": new FormControl('', [Validators.required]),
      "a": new FormControl('', [Validators.required]),
      "discount": new FormControl('', [Validators.required]),
      "b": new FormControl('', [Validators.required]),
      "tax": new FormControl('', [Validators.required]),
      "amount": new FormControl('', [Validators.required]),

    })
  }
  add_row() {
    (<FormArray>this.adduserForm.get('user')).push(this.userinfo())
  }
  deleteRow(i) {
    (<FormArray>this.adduserForm.get('user')).removeAt(i)
  }


  searchFirm(firm) {

    const val = firm;

    this.sortTable('return_date');

    if (this.search_date_array) {
      this.manufacture_data = this.search_date_array;
    }
    else if (this.search_month_array) {
      this.manufacture_data = this.search_month_array;
    }
    else {
      this.manufacture_data = this.manufacture_data2;
    }

    var temp = this.manufacture_data.filter(d => {
      const vals = Object.values(d);
      return new RegExp(val, 'gi').test(vals.toString());
    });

    this.manufacture_data = temp;
    this.manufacture_data_length = temp.length;
    console.log(this.manufacture_data_length);
  }

  searchmonth(m) {
    console.log(m);

    let p = this.manufacture_data2.map((x) => {
      return {
        item_name: x.item_name,
        return_date: this.datePipe.transform(x.return_date, 'dd MMM y')
      }
    });

    this.sortTable('return_date');

    this.manufacture_data = p;
    var temp = this.manufacture_data.filter(a => {
      var date = this.datePipe.transform(a.return_date, 'MMMM');
      return (date == m);
    });
    console.log(temp);
    this.manufacture_data = temp;
    this.search_month_array = temp;
    this.search_date_array = [];
    console.log(this.search_month_array);

    this.manufacture_data_length = temp.length;
  }

  searchDate() {
    this.srh_date = new Date(this.datePipe.transform(this.fateRange, 'dd MMM y'));
    this.srh_date2 = new Date(this.datePipe.transform(this.fateRange1, 'dd MMM y'));
    console.log(this.srh_date);
    console.log(this.srh_date2);
    console.log(this.srh_date < this.srh_date2);
    console.log(this.manufacture_data2);

    let p = this.manufacture_data2.map((x) => {
      return {
        item_name: x.item_name,
        return_date: this.datePipe.transform(x.return_date, 'dd MMM y')
      }
    });

    this.sortTable('return_date');

    console.log(this.srh_date);
    console.log(this.srh_date2);

    this.manufacture_data = p;
    var temp = this.manufacture_data.filter(a => {
      var date = new Date(a.return_date);
      console.log(date);
      
      return (date >= this.srh_date && date <= this.srh_date2);
    });
    console.log(temp)
    this.manufacture_data = temp;
    this.search_date_array = temp;
    this.search_month_array = [];
    console.log(this.search_date_array);

    this.manufacture_data_length = temp.length;

  }

  chooseItem(form_cont, item){
    form_cont.patchValue({
      a: 0,
      discount: 0,
      quantity: 1,
    });

    console.log(item);
    console.log(form_cont);
    console.log(this.adduserForm);
    console.log(this.item_data);

    if (item != "ch_item") {
      let gst;
      let GST;
      let mrp;

      for (let i = 0; i < this.item_data.length; i++) {
        if (this.item_data[i].item_id == item) {
          GST = parseInt(this.item_data[i].gst);

            mrp = this.item_data[i].mrp;
            gst = mrp * (GST / 100);

            form_cont.patchValue({
              b: GST,
              tax: gst,
              hsn: this.item_data[i].hsn,
              price: mrp,
              unit: this.item_data[i].unit
            });
          
        }
      }

    }

    this.calc_total(form_cont.controls);
  }

  calc_total(form_cont) {

    let prc: number = form_cont.price.value;
    let qt: number = form_cont.quantity.value;
    let discnt: number = form_cont.discount.value;
    let item = form_cont.item.value;

    let gst: number;
    let GST: number;

    for (let i = 0; i < this.item_data.length; i++) {
      if (this.item_data[i].item_id == item) {

        GST = parseInt(this.item_data[i].gst);
        gst = prc * (GST / 100);
      }
    }

    console.log(form_cont);
    let total: number = 0;
    let total_gst: number = 0;

    if (qt) {

      total_gst = parseFloat((gst * qt).toFixed(2));
        total = parseFloat((total_gst + ((prc * qt) - discnt)).toFixed(2));      

      form_cont.amount.patchValue(total);
      form_cont.tax.patchValue(total_gst);
      console.log(form_cont);
    }

  }

  totalCalculation() {

    var pform = this.adduserForm.get('user')['controls'];

    this.t_gst = 0;
    this.t_amount = 0;

    for (let i = 0; i < pform.length; i++) {
      this.t_gst = this.t_gst + pform[i].value.tax;
      this.t_amount = this.t_amount + pform[i].value.amount;
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

  add_purchase_details = () => {

    this.adduserformArray = [];
    var p_form = this.adduserForm.get('user')['controls'];
    console.log(p_form);

    for (let i = 0; i < p_form.length; i++) {
      console.log(p_form[i].value);
      this.adduserformArray.push(p_form[i].value)
    }

    if (this.adduserformArray) {

      var user_arr = this.adduserformArray.map((u_array) => {
        return {
          prod_id: u_array.category,
          igst: u_array.igst,
          cgst: u_array.cgst,
          sgst: u_array.sgst,
          price: u_array.price,
          qty: u_array.qty,
          discount: u_array.discount,
          total: u_array.total
        }
      });

    }

    this.loader = true;
    console.log(this.userForm.get('invo').value,);
    console.log(this.adduserformArray);
    const reqBody = {
    }

    this.ErpService.post_Reqs(erp_all_api.urls.trd_sale_entry, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res, "get item");
        this.adduserForm.reset();
      },
      (err: any) => {
        console.log(err);
        console.log(err.error.msg);
      });
  };

}
