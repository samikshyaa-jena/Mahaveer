import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../../erp-service.service';
import { erp_all_api } from '../../../erpAllApi';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private ErpService: ErpServiceService,
    private datePipe: DatePipe,
  ) {

    this.userForm = new FormGroup({
      "choose_vender": new FormControl('ch_vender'),
    })

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

    this.monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.firmList = ['abc', 'xyz', 'pqr'];
    this.td = ['1', '2', '3'];
  }

  getcategory() {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);
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
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

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
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

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
      "model_no": new FormControl('', [Validators.required]),
      "variant": new FormControl('', [Validators.required]),
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


  // searchFirm(firm) {

  //   const val = firm;

  //   this.sortTable('return_date');

  //   if (this.search_date_array) {
  //     this.manufacture_data = this.search_date_array;
  //   }
  //   else if (this.search_month_array) {
  //     this.manufacture_data = this.search_month_array;
  //   }
  //   else {
  //     this.manufacture_data = this.manufacture_data2;
  //   }

  //   var temp = this.manufacture_data.filter(d => {
  //     const vals = Object.values(d);
  //     return new RegExp(val, 'gi').test(vals.toString());
  //   });

  //   this.manufacture_data = temp;
  //   // this.search_array = temp;
  //   this.manufacture_data_length = temp.length;
  //   console.log(this.manufacture_data_length);
  // }

  searchmonth(m) {
    this.filterForm.get('fromDate').reset();
    this.filterForm.get('toDate').reset();
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
    this.filterForm.get('month').setValue('Choose Month');
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
      // date = date.parse(myDate);
      // date = date.getTime();
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

  calc_total(i) {
    console.log(i);
    
  }
  // calc_total(i) {
  //   let prc=i.get('price').value;
  //   let qt=i.get('quantity').value;
  //   let discnt=i.get('discount').value;
  //   let igst = i.get('igst').value;
  //   let sgst =i.get('sgst').value;
  //   let cgst = i.get('cgst').value;
  //   let total = 0;
  //   let gstTotal = (igst + cgst + sgst)/100;
  //   let sum = 0;
  //   sum = qt*prc
  //   total = ((sum*gstTotal) + sum)-discnt;
  //   i.patchValue({
  //      total:total
  //   })
  // }


}