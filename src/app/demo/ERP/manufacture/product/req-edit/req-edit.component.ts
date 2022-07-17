import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as Notiflix from 'notiflix';
import { ErpServiceService } from '../../../erp-service.service';
import { erp_all_api } from '../../../erpAllApi';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-req-edit',
  templateUrl: './req-edit.component.html',
  styleUrls: ['./req-edit.component.scss']
})
export class ReqEditComponent implements OnInit {

  @Output() BackTab = new EventEmitter<boolean>();
  @Input() getProductData;

  t_gst: number;
  t_amount: number;
  itemname: any;
  type: any;
  p_array: any = [];
  itemData2: any = [];
  requirementformarray: any = [];
  loader: boolean;

  item_form: FormGroup;
  updatemat: FormGroup;
  rawMat: any;

  constructor(
    private ErpService: ErpServiceService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) { 
    this.updatemat = new FormGroup({
      "product": new FormArray([

      ])
    })

    this.item_form = new FormGroup({
      prod_name: new FormControl("", [Validators.required]),
      prod_id: new FormControl(""),
      est_time: new FormControl("1", [Validators.required]),
      // gst: new FormControl("", [Validators.required]),
      // stock: new FormControl("", [Validators.required]),
      // unit: new FormControl("", [Validators.required]),
      // mrp: new FormControl("", [Validators.required]),
      // hsn: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {

    this.getRawmaterials();

    console.log(this.getProductData);

    this.item_form.patchValue({
      prod_name: this.getProductData.prod_name,
      prod_id: this.getProductData.prod_id,
      est_time: this.getProductData.approx_time,
      // gst: this.getProductData.gst,
      // stock: this.getProductData.min_stock,
      // unit: this.getProductData.unit,
      // mrp: this.getProductData.price,
      // hsn: this.getProductData.hsn,
    });

    var p_form = this.updatemat.get('product')['controls'];
    console.log(p_form);
    
    for (let i = 0; i < this.getProductData.materials_data.length; i++) {
      this.add_row();

      p_form[i].patchValue({
        item: this.getProductData.materials_data[i].mat_id,
        gst_rate: this.getProductData.materials_data[i].mat_gst,
        gst: this.getProductData.materials_data[i].mat_gst,
        hsn: this.getProductData.materials_data[i].mat_hsn,
        price: this.getProductData.materials_data[i].mrp,
        qty: this.getProductData.materials_data[i].quantity,
        unit: this.getProductData.materials_data[i].mat_unit,
      });
      this.calc_total(p_form[i].controls);
      
    }   

    // setTimeout(() => {
      this.totalCalculation();
    // }, 50000)
    
  }

  getRawmaterials(){

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.get_rawmat, { headers: headers }).pipe(finalize(() => {this.loader = false;})).subscribe(
      (res: any) =>{
        console.log(res);
        this.rawMat = res.data;                
      },
      (err: any) =>{
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
        
      });

  }

  matdata(): FormGroup {
    return this.fb.group({

      item: new FormControl('choose_mat', [Validators.required]),
      gst_rate: new FormControl('', [Validators.required]),
      gst: new FormControl('', [Validators.required]),
      hsn: new FormControl(''),
      price: new FormControl('0', [Validators.required]),
      qty: new FormControl('1', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      total: new FormControl('', [Validators.required]),
      edit: new FormControl(false)

    })
  }

  add_row() {
    (<FormArray>this.updatemat.get('product')).push(this.matdata())
  }
  add_row2() {
    (<FormArray>this.updatemat.get('product')).push(this.matdata())

    var m_form = this.updatemat.get('product')['controls'];
    var l: number = (m_form.length) - 1;
    console.log(l);

    m_form[l].controls.edit.patchValue(true);
  }
  deleteRow(i) {
    (<FormArray>this.updatemat.get('product')).removeAt(i)
  }

  
  chooseProduct(form_cont, item) {

    form_cont.patchValue({
      discount: 0,
      qty: 1,
    });

    console.log(item);
    console.log(form_cont);
    console.log(this.item_form);
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

    console.log(form_cont);
    

    let prc: number = form_cont.price.value;
    let qt: number = form_cont.qty.value;
    let GST: number = form_cont.gst_rate.value;
   let item = form_cont.item.value;

    let gst: number;

    for (let i = 0; i < this.getProductData.materials_data.length; i++) {
      if (this.getProductData.materials_data[i].mat_id == item) {

        gst = prc * (GST / 100);
        console.log(GST);
        console.log(this.getProductData.materials_data[i].mat_gst);
        
        console.log(gst);
        
      }
    }

    console.log(gst);

    let total: number = 0;
    let total_gst: number = 0;

    if (qt) {

      total_gst = gst * qt;
      total = total_gst + (prc * qt);


      form_cont.total.patchValue(total);
      form_cont.gst.patchValue(total_gst);
      console.log(form_cont);
    }

  }


  totalCalculation() {

    var pform = this.updatemat.get('product')['controls'];

    this.t_gst = 0;
    this.t_amount = 0;

    for (let i = 0; i < pform.length; i++) {
      this.t_gst = this.t_gst + pform[i].value.gst;
      this.t_amount = this.t_amount + pform[i].value.total;
    }

  }
  Edit(pform, i) {

    console.log(pform);
    console.log(pform.edit.value);
    pform.edit.value = true;


  }

  resetmatForm() {
    var m_form = this.updatemat.get('product')['controls'];
    console.log(m_form);
    m_form.splice(0, m_form.length);
    console.log(m_form);
    this.totalCalculation()
  }

  add_requirement = () => {

    this.requirementformarray = [];
    var p_form = this.updatemat.get('product')['controls'];
    console.log(p_form);
    
    for (let i = 0; i < p_form.length; i++) {
      console.log(p_form[i].value);
      this.requirementformarray.push(p_form[i].value)
    }

    if (this.requirementformarray) {

      var product_arr = this.requirementformarray.map((p_array) => {
        return {
          mat_id: p_array.item,
          qty: p_array.qty,
        }
      });

    }

    this.loader = true;
    console.log(this.requirementformarray);
    const reqBody = {
      "prod_id": this.item_form.get('prod_id').value,
      "targetTime": this.item_form.get('est_time').value + 'D',
      "added_by": "",
      "requirements": product_arr,
    }

    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.update_prod_req, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success('SuccessFully Added', '', 'Close');
        console.log(res, "get item");
        this.item_form.reset();
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

}
