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
  control: FormGroup;
  userformnumber: []
  // userinfo: any;
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
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);
    const cat_body = {
      "type": "rawmaterial"
    };

    this.ErpService.post_Reqs(erp_all_api.urls.getCatogory, cat_body, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
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
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_Vendor, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
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
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_Item, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
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

      "item": new FormControl('ch_item'),
      "model_no": new FormControl(''),
      "variant": new FormControl(''),
      "quantity": new FormControl(''),
      "unit": new FormControl('None'),
      "price": new FormControl(''),
      "a": new FormControl(''),
      "discount": new FormControl(''),
      "b": new FormControl(''),
      "tax": new FormControl(''),
      "amount": new FormControl(''),

    })
  }
  add_row() {
    (<FormArray>this.userForm.get('user')).push(this.userinfo())
  }
  deleteRow(i) {
    (<FormArray>this.userForm.get('user')).removeAt(i)
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
    // this.search_array = temp;
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

}
