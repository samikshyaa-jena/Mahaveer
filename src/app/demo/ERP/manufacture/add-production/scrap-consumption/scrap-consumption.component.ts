import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Notiflix from 'notiflix';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../../erp-service.service';
import { erp_all_api } from '../../../erpAllApi';

@Component({
  selector: 'app-scrap-consumption',
  templateUrl: './scrap-consumption.component.html',
  styleUrls: ['./scrap-consumption.component.scss']
})
export class ScrapConsumptionComponent implements OnInit {

  @Input() rawmatData;
  @Input() edit;
  @Output() BackTab = new EventEmitter<boolean>()

  scrapForm: FormGroup;
  consumptionForm: FormGroup;
  getscrapData: any;
  getscrapData2: any;
  loader: boolean;
  getconsData: any;
  getconsData2: any;
  t_rawmat: number = 0;
  t_cons: number = 0;
  total: number = 0;
  scrapformarray: any = [];
  today = new Date();
  consformarray: any = [];

  constructor(
    private fb: FormBuilder,
    private ErpService: ErpServiceService,
    private datePipe: DatePipe,
    private modalService: NgbModal

  ) {
    this.scrapForm = new FormGroup({
      "Scrap": new FormArray([])
    })
    this.consumptionForm = new FormGroup({
      "Consumption": new FormArray([])
    })
  }

  ngOnInit() {

    console.log(this.edit);
    console.log(this.rawmatData);

    if (this.edit) {
      this.add_row();
      this.add_row2();
      
    }

    // var s_form = this.scrapForm.get('Scrap')['controls'];
    // console.log(s_form);

    for (let i = 0; i < this.rawmatData.used_raw_mat_data.length; i++) {
      this.t_rawmat += this.rawmatData.used_raw_mat_data[i].mrp;
    }

    // for (let i = 0; i < this.rawmatData.scrap_data.length; i++) {
    //   this.add_row();

    //   s_form[i].patchValue({
    //     scrap: this.rawmatData.scrap_data[i].type,
    //     qty: this.rawmatData.scrap_data[i].qty,
    //     unit: this.rawmatData.scrap_data[i].unit,
    //     edit: false,
    //   });

    // }

    // var c_form = this.consumptionForm.get('Consumption')['controls'];
    // console.log(c_form);

    for (let i = 0; i < this.rawmatData.consumption_data.length; i++) {
      // this.add_row2();

      // c_form[i].patchValue({
      //   consumption: this.rawmatData.consumption_data[i].type,
      //   cost: this.rawmatData.consumption_data[i].cost,
      //   edit: false,
      // });

      this.t_cons += this.rawmatData.consumption_data[i].cost;

    }

    this.getScrap();
    this.getConsumption();
    this.totalCalculation();

  }

  matdata(): FormGroup {
    return this.fb.group({
      scrap: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      // edit: new FormControl(true)
    })
  }
  matdata2(): FormGroup {
    return this.fb.group({
      consumption: new FormControl('', [Validators.required]),
      cost: new FormControl('', [Validators.required]),
      // edit: new FormControl(true)
    })
  }

  add_row() {
    (<FormArray>this.scrapForm.get('Scrap')).push(this.matdata())
  }
  add_row2() {
    (<FormArray>this.consumptionForm.get('Consumption')).push(this.matdata2())
  }
  deleteRow(i) {
    (<FormArray>this.scrapForm.get('Scrap')).removeAt(i)
  }
  deleteRow2(i) {
    (<FormArray>this.consumptionForm.get('Consumption')).removeAt(i)
  }

  previousPage() {
    this.BackTab.emit();
  }

  getScrap = () => {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_scrap).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);

        this.getscrapData = res.data;
        this.getscrapData2 = res.data;

        console.log(this.getscrapData);
        // console.log(this.getscrapData2);


      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };
  getConsumption = () => {
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_consumption).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);

        this.getconsData = res.data;
        this.getconsData2 = res.data;

        console.log(this.getconsData);
        // console.log(this.getconsData2);


      },
      (err: any) => {
        Notiflix.Report.failure(err.error.msg, '', 'Close');

      });

  };

  getSc(event) {
    console.log(this.getscrapData2);

    if (event.target.value != '') {
      const val = event.target.value;
      this.getscrapData = this.getscrapData2;
      var temp = this.getscrapData.filter(d => {
        const vals = d.type;
        console.log(vals);

        return new RegExp(val, 'gi').test(vals.toString());
      });

      this.getscrapData = temp;
    }
  }

  selectScrap(obj, form_cont) {
    console.log(obj);
    // this.scrapForm.controls.scrap.setValue(obj.type);
    form_cont.scrap.patchValue(obj.type);
  }
  getcn(event) {
    console.log(this.getconsData2);

    if (event.target.value != '') {
      const val = event.target.value;
      this.getconsData = this.getconsData2;
      var temp = this.getconsData.filter(d => {
        const vals = d.type;
        console.log(vals);

        return new RegExp(val, 'gi').test(vals.toString());
      });

      this.getconsData = temp;
    }
  }

  selectCons(obj, form_cont) {
    console.log(obj);
    // this.scrapForm.controls.scrap.setValue(obj.type);
    form_cont.consumption.patchValue(obj.type);
  }

  addScrap = () => {
    this.loader = true;

    this.scrapformarray = [];
    var p_form = this.scrapForm.get('Scrap')['controls'];
    console.log(p_form);

    for (let i = 0; i < p_form.length; i++) {
      console.log(p_form[i].value);
      this.scrapformarray.push(p_form[i].value)
    }

    console.log(this.scrapformarray);


    if (this.scrapformarray) {

      var product_arr = this.scrapformarray.map((p_array) => {
        return {
          type: p_array.scrap,
          qty: p_array.qty,
          unit: p_array.unit,
          entry_date: this.datePipe.transform(this.today, 'yyyy-MM-dd')
        }
      });

    }

    this.loader = true;
    console.log(this.scrapformarray);
    const reqBody = {
      "production_id": this.rawmatData.production_id,
      "sacrap_data": product_arr,
    }

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.add_scrap, reqBody).subscribe(
      (res: any) => {
        // Notiflix.Report.success('SuccessFully Added', '', 'Close');
        console.log(res, "get item");
        // this.previousPage();
        this.addConsumption();
      },
      (err: any) => {
        this.loader = false;
        console.log(err);
        console.log(err.error.msg);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };
  addConsumption = () => {

    this.consformarray = [];
    var p_form = this.consumptionForm.get('Consumption')['controls'];
    console.log(p_form);

    for (let i = 0; i < p_form.length; i++) {
      console.log(p_form[i].value);
      this.consformarray.push(p_form[i].value)
    }

    console.log(this.consformarray);


    if (this.consformarray) {

      var product_arr = this.consformarray.map((p_array) => {
        return {
          type: p_array.consumption,
          cost: p_array.cost,
          entry_date: this.datePipe.transform(this.today, 'yyyy-MM-dd')
        }
      });

    }

    this.loader = true;
    console.log(this.consformarray);
    const reqBody = {
      "production_id": this.rawmatData.production_id,
      "consumption_data": product_arr,
    }

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.add_consumption, reqBody).subscribe(
      (res: any) => {
        this.loader = false;
        Notiflix.Report.success('SuccessFully Added', '', 'Close');
        console.log(res, "get item");
        this.previousPage();
      },
      (err: any) => {
        this.loader = false;
        console.log(err);
        console.log(err.error.msg);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };

  calc_total(form_cont) {

    var pform = this.consumptionForm.get('Consumption')['controls'];
    console.log(pform);
    console.log(form_cont);
    if (form_cont.cost.value != null || form_cont.cost.value != '') {
      this.t_cons = 0;

      for (let i = 0; i < pform.length; i++) {
        this.t_cons = this.t_cons + parseFloat(pform[i].value.cost);
      }

    } else {
      this.t_cons = this.t_cons;
    }

    this.totalCalculation();

  }

  totalCalculation() {
    this.total = 0
    this.total = this.t_rawmat + this.t_cons;
  }

  prevent_0(e: any) {
    // return e.keyCode >= 48 && e.charCode <= 57;
    var v = parseInt(e.target.value)

    if (v > 0) {
      return e.keyCode >= 48 && e.charCode <= 57;
    } else {
      return e.keyCode > 48 && e.charCode <= 57;
    }
  }
  prevent_char(e: any) {
    return e.keyCode >= 48 && e.charCode <= 57;
  }

  deletePopup(content1) {
    this.modalService.dismissAll(content1);
  }
  item_delete_popup_open(content1) {
    this.modalService.open(content1);
  }
}
