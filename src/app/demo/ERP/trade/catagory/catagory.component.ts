import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as Notiflix from 'notiflix';
import { finalize } from 'rxjs/operators';
import { ErpServiceService } from '../../erp-service.service';
import { erp_all_api } from '../../erpAllApi';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category',
  templateUrl: './catagory.component.html',
  styleUrls: ['./catagory.component.scss']
})
export class CategoryComponent implements OnInit {

  delete_popup: boolean;
  addCategoryForm: FormGroup;
  editItemForm: FormGroup;
  show_cat: boolean;
  loader: boolean;
  show_edit: boolean;
  addCategoryData: any;
  getCategoryData: any = [];
  itemList: any = [];
  cat_id: any;
  show: boolean = false;
  cat_index: any;
  show_cat_item = 1;
  category_Id: any;
  cat_data: any = [];
  updateCatForm: FormGroup;
  editCatIndex: any;
  addItemForm: FormGroup;
  cat: any;
  editItemIndex: any;
  modeForm: FormGroup;
  page = 1;
  pageSize =5;
  collectionSize: [];
  reports: any=[];
  report_length: any;
  uploadedFiles: any;
  imgpath: any;

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) { 
    this.modeForm = new FormGroup({
      mode: new FormControl("Choose Type")
    });
    this.addCategoryForm = new FormGroup({
      cat_name: new FormControl("", [Validators.required])
    });
    this.updateCatForm = new FormGroup({
      cat_name: new FormControl("", [Validators.required])
    });
    this.addItemForm = new FormGroup({
      category_name: new FormControl("choose a category", [Validators.required]),
      item_name: new FormControl("", [Validators.required]),
      gst: new FormControl("", [Validators.required]),
      min_stk: new FormControl("", [Validators.required]),
      unit: new FormControl("", [Validators.required]),
      hsn: new FormControl("", [Validators.required]),
      qty: new FormControl("", [Validators.required]),
      mrp: new FormControl("", [Validators.required]),
    });
    this.editItemForm = new FormGroup({
      category_name: new FormControl("choose a category", [Validators.required]),
      item_name: new FormControl("", [Validators.required]),
      gst: new FormControl("", [Validators.required]),
      min_stk: new FormControl("", [Validators.required]),
      unit: new FormControl("", [Validators.required]),
      hsn: new FormControl("", [Validators.required]),
      qty: new FormControl("", [Validators.required]),
      mrp: new FormControl("", [Validators.required]),
    });
   }

   ngOnInit() {
    this.get_Category();
  }

  changeType = (e)=>{
    console.log(e);
    if (e == 'manufcture') {
      this.router.navigate(["/v2/Erpmain/category"])
    }
  }

  // edit cat popup open
  cat_edit_popup_open(content, i) {
    this.editCatIndex = i;
    this.updateCatForm.patchValue({
      cat_name: this.cat_data[i].cat_name,
    })
    this.modalService.open(content);
  }
  // edit cat popup close
  cat_edit_popup_close(content) {
    this.modalService.dismissAll(content);
    this.updateCatForm.reset();
  }

  // edit cat popup open
  item_edit_popup_open(content1, i) {
    this.editItemIndex = i;
    this.editItemForm.patchValue({
      item_name: this.itemList[i].prod_name,
      gst: this.itemList[i].gst,
      min_stk: this.itemList[i].min_stock,
      unit: this.itemList[i].unit,
      hsn: this.itemList[i].hsn,
      category_name: this.cat_data[this.cat_index].cat_name,
    });
    this.modalService.open(content1);
  }
  // edit cat popup close
  item_edit_popup_close(content1) {
    this.modalService.dismissAll(content1);
    this.editItemForm.reset();
  }
  get_Category = () => {
    this.cat_data.length=0;
    this.getCategoryData.length=0;
    this.loader = true;
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.get_Reqs(erp_all_api.urls.getTradeCat, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        let catData = res.data;
        for (let i = 0; i < catData.length; i++) {
          if (catData[i].delete_stat == 0) {
            this.getCategoryData.push(catData[i]);
          }
        }
        console.log("response is", catData);
        this.cat_data = this.getCategoryData.map((val) => {
          return { cat_id: val.cat_id, cat_name: val.cat_name, itemData: val.itemData };
        });
        this.reports = this.cat_data;
        this.collectionSize=this.cat_data.length
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });

  };
  add_Category = () => {
    this.loader = true;
    const reqBody = {
      name: this.addCategoryForm.get("cat_name").value,
    }
    console.log(reqBody);


    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.add_TradeCat, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log("response is", this.addCategoryData);
        this.cat_data.length=0;
        this.getCategoryData.length=0;
        this.show_cat_item = 1;
        this.addCategoryData = res;
        this.get_Category();
        this.addCategoryForm.reset();
        Notiflix.Report.success(res.msg, '', 'Close');
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });

  };

  del_Category = (i) => {
    this.loader = true;
    const reqBody =
    {
      "cat_id": this.cat_data[i].cat_id
    }
    console.log(reqBody);
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.del_TradeCat, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success(res.msg, '', 'Close');
        this.addCategoryData = res;
        console.log("response is", this.addCategoryData);
        this.getCategoryData = [];
        this.get_Category();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };

  del_item = (i) => {
    this.loader = true;
    const reqBody =
    {
      "prod_id": this.itemList[i].prod_id
    }
    console.log(reqBody);
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.del_prod, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success(res.msg, '', 'Close');
        this.itemList = [];
        this.getProd();

      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };

  edit_Category = () => {
    this.loader = true;
    const reqBody =
    {
      "name": this.updateCatForm.get('cat_name').value,
      "cat_id": this.cat_data[this.editCatIndex].cat_id,
    }
    console.log(reqBody);
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.edit_TradeCat, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        Notiflix.Report.success(res.msg, '', 'Close');
        this.getCategoryData = [];
        this.get_Category();
        this.updateCatForm.reset();
        this.cat_edit_popup_close('content');

      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };

  edit_item = () => {
    this.loader = true;
    const reqBody =
    {
      "prod_id": this.itemList[this.editItemIndex].prod_id,
      "prod_name": this.editItemForm.get('item_name').value,
      "gst": this.editItemForm.get('gst').value,
      "min_stock": this.editItemForm.get('min_stk').value,
      "unit": this.editItemForm.get('unit').value,
      "mrp": parseFloat(this.editItemForm.get('mrp').value),
    }
    console.log(reqBody);
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.edit_prod, reqBody, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        this.cat_edit_popup_close('content');
        Notiflix.Report.success(res.msg, '', 'Close');
        this.itemList = [];
        this.getProd();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  };
  showAddCategory = () => {
    this.show_cat = true;
    this.show_edit = false
  }
  backAddCategory = () => {
    this.show_cat = false;
    this.show_edit = false;
  }
  categoryAction(i) {
    this.cat_id = [];
    this.loader = true;
    this.cat_index = i;
    this.cat_id = this.cat_data[i].cat_id;
    this.show_cat_item = 3;
    this.getProd();
  }
  getProd = () => {
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);
    let params = { cat_id: this.cat_id }

    this.ErpService.get_Reqs(erp_all_api.urls.get_prod, { headers: headers, params: params }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        this.itemList = [];
        console.log("response is", res.data);
        let itemData = res.data;
        for (let i = 0; i < itemData.length; i++) {
          if (itemData[i].delete_stat == 0) {
            this.itemList.push(itemData[i]);
          }
        }
      },
      (err: any) => {
        console.log(err);

      });
  }

  show_add_item = () => {
    this.show = true;
  }
  hide_add_item = () => {
    this.show = false;
  }
  addItemCategory(event) {
    this.cat = event;
  }
  add_item = () => {

    this.loader = true;
    let qnt = this.addItemForm.get('qty').value ? parseInt(this.addItemForm.get('qty').value) : 0;

    const fd: any = new FormData();
    fd.append('cat_id', this.cat);
    fd.append('name', this.addItemForm.get('item_name').value);
    fd.append('gst', parseInt(this.addItemForm.get('gst').value));
    fd.append('min_stock', parseInt(this.addItemForm.get('min_stk').value));
    fd.append('unit', this.addItemForm.get('unit').value);
    fd.append('mrp', parseFloat(this.addItemForm.get('mrp').value));
    fd.append('hsn', parseFloat(this.addItemForm.get('hsn').value));
    fd.append('qty', qnt);
    fd.append('prod_image', this.uploadedFiles, this.uploadedFiles.name);

    
    // const reqBody = {
    //   cat_id: this.cat,
    //   name: this.addItemForm.get('item_name').value,
    //   gst: parseInt(this.addItemForm.get('gst').value),
    //   min_stock: parseInt(this.addItemForm.get('min_stk').value),
    //   unit: this.addItemForm.get('unit').value,
    //   mrp: parseFloat(this.addItemForm.get('mrp').value),
    //   hsn: parseInt(this.addItemForm.get('hsn').value),
    //   qty: qnt

    // }
    console.log(fd);
    let auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vyc0RldGFpbHMiOnsidXNlcklkIjoiQ3ZUZGZMMDhJUThzdTgzclRxTlNYam5DeEpSVEFCVWEiLCJuYW1lIjoiYWRtaW4iLCJ1c2VyVHlwZSI6ImFkbWluIiwic3RhdHVzIjoxLCJjcmVhdGVkX2F0IjoiMjAyMi0wMi0xOVQwMzozMToyOC4wMDBaIiwicGFzc3dvcmQiOiIkMmIkMTAkNk9SSWRDLnNadVJ6Lnc1Y3JIWEpXZTlGQkQvU0h6OFhydEgvQ2g0aXJxbnpuQmxaeUI2akciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDU0MjY5NTZ9.1082MNi-TtAV1I4zLDdZlWY3_OjiqBXAnCqFDJP44Gk'
    let headers = new HttpHeaders();
    headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.add_prod, fd, { headers: headers }).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log("response is", res);
        Notiflix.Report.success(res.msg, '', 'Close');
        this.show_cat_item = 1;
        this.addItemForm.reset();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');
      });
  }
   // filter
   updateFilter(event: any) {
    const val = event.target.value;
     console.log(val);
    //  let datavalues = this.reports;

    //  this.reports = this.cat_data;
     console.log(this.reports);
    var temp = this.reports.filter(d => {
      const vals = Object.values(d);
      console.log(vals);
      return new RegExp(val, 'gi').test(vals.toString());
    });
    this.cat_data = temp;
    this.report_length = temp.length;
    console.log(this.report_length);
  }

  onUpload(event) {
    const file: File = event.target.files[0];
        if (file) {
          this.uploadedFiles = file;
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (e) => {
            this.imgpath = reader.result
            document.getElementById('pre_img').setAttribute('src', this.imgpath)
          }
    }

  }

  prevent(e) {
    console.log(e);
      return e.keyCode >= 48 && e.charCode <= 57;
  }

}
