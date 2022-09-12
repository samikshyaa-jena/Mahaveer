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
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  updateProduct: string;
  addProductForm: FormGroup;
  editProductForm: FormGroup;
  getProductData: any = [];
  showUpdate: boolean = false;
  loader: boolean;
  prod_id_index: any;

  //showAddProd: boolean=false;
  prod_table: boolean = true;
  req_entry: boolean;
  getProductData2: any = [];
  imgpath: any;
  uploadedFiles: any;

  constructor(
    private ErpService: ErpServiceService,
    private http: HttpClient,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    this.addProductForm = new FormGroup({
      prod_name: new FormControl("", [Validators.required]),
      gst: new FormControl("Select GST", [Validators.required]),
      min_stk: new FormControl("", [Validators.required]),
      unit: new FormControl("", [Validators.required]),
      hsn: new FormControl("", [Validators.required]),
      mrp: new FormControl("", [Validators.required]),
      img: new FormControl(""),
    });
    this.editProductForm = new FormGroup({
      prod_name: new FormControl("", [Validators.required]),
      gst: new FormControl("", [Validators.required]),
      min_stk: new FormControl("", [Validators.required]),
      unit: new FormControl("", [Validators.required]),
      mrp: new FormControl("", [Validators.required]),
      hsn: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.get_Product();
  }

  // edit cat popup open
  product_edit_popup_open(content, i) {
    this.prod_id_index = i;
    this.editProductForm.patchValue({
      prod_name: this.getProductData[i].prod_name,
      gst: this.getProductData[i].gst,
      min_stk: this.getProductData[i].min_stock,
      unit: this.getProductData[i].unit,
      mrp: this.getProductData[i].price,
      hsn: this.getProductData[i].hsn,
    });
    this.modalService.open(content);
  }
  // edit cat popup close
  product_edit_popup_close(content) {
    this.modalService.dismissAll(content);
  }

  hide_add_item = () => {
    //showAddProd = false;
    this.prod_table = false;
  }

  get_Product = () => {
    this.getProductData = [];
    this.loader = true;
    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    // this.ErpService.get_Reqs(erp_all_api.urls.getProduct).pipe(finalize(() => {this.loader = false;})).subscribe(
    this.ErpService.get_Reqs(erp_all_api.urls.get_profuct_req).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);
        let prod = res.data;
        for (let i = 0; i < prod.length; i++) {
          if (prod[i].delete_stat == 0) {
            this.getProductData.push(prod[i]);
          }
        }
        console.log(this.getProductData);

      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');;

      });

  };

  add_Product = () => {
    // this.loader = true;
    Notiflix.Loading.standard('Loading...');
    console.log(this.uploadedFiles);

    // var gst: number = parseInt(this.addProductForm.get('gst').value);

    var fd: any;

    if (this.uploadedFiles != undefined || this.uploadedFiles != '') {
      fd = new FormData();
      fd.append('prod_name', this.addProductForm.get('prod_name').value);
      fd.append('gst', parseInt(this.addProductForm.get('gst').value));
      fd.append('min_stock', parseInt(this.addProductForm.get('min_stk').value));
      fd.append('unit', this.addProductForm.get('unit').value);
      fd.append('price', this.addProductForm.get('mrp').value);
      fd.append('prod_image', this.uploadedFiles, this.uploadedFiles.name);
    } else {
      fd = {
        prod_name: this.addProductForm.get('prod_name').value,
        gst: parseInt(this.addProductForm.get('gst').value),
        min_stock: parseInt(this.addProductForm.get('min_stk').value),
        unit: this.addProductForm.get('unit').value,
        price: this.addProductForm.get('mrp').value,
        prod_image: ''
      };
    }

    // const reqBody = {
    //   prod_name: this.addProductForm.get('prod_name').value,
    //   gst: parseInt(this.addProductForm.get('gst').value),
    //   min_stock: parseInt(this.addProductForm.get('min_stk').value),
    //   unit: this.addProductForm.get('unit').value,
    //   price: 0,
    //   prod_image: fd
    // };

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.addProduct, fd).pipe(finalize(() => { Notiflix.Loading.remove(); })).subscribe(
      (res: any) => {
        console.log(res);
        Notiflix.Report.success(res.msg, '', 'Close');;
        this.getProductData = [];
        this.get_Product();
        this.addProductForm.reset();
        this.hideAddProduct();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');;

      });

  };
  edit_Product = () => {
    this.loader = true;
    const reqBody = {
      prod_id: this.getProductData[this.prod_id_index].prod_id,
      prod_name: this.editProductForm.get('prod_name').value,
      gst: parseInt(this.editProductForm.get('gst').value),
      min_stock: parseInt(this.editProductForm.get('min_stk').value),
      unit: this.editProductForm.get('unit').value,
      price: 0
    };

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.updateProduct, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);
        Notiflix.Report.success(res.msg, '', 'Close');;
        this.editProductForm.reset();
        this.product_edit_popup_close('content');
        this.get_Product();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');;

      });

  };

  delete_Product = (i) => {
    this.loader = true;
    const reqBody = {
      "prod_id": this.getProductData[i].prod_id
    };

    // let auth_token = sessionStorage.getItem('CORE_SESSION');
    // let headers = new HttpHeaders();
    // headers = headers.set('auth-token', auth_token);

    this.ErpService.post_Reqs(erp_all_api.urls.deleteProduct, reqBody).pipe(finalize(() => { this.loader = false; })).subscribe(
      (res: any) => {
        console.log(res);
        Notiflix.Report.success(res.msg, '', 'Close');;
        this.get_Product();
      },
      (err: any) => {
        console.log(err);
        Notiflix.Report.failure(err.error.msg, '', 'Close');;

      });

  };

  showAddProduct() {
    //showAddProd = true;
    this.prod_table = false;
    this.req_entry = false;
  };
  hideAddProduct() {
    //showAddProd = false;
    this.prod_table = true;
    this.req_entry = false;
    this.addProductForm.reset();
  };

  openUpdateProductPage = (i) => {
    //showAddProd = false;
    this.prod_table = true;
    this.req_entry = true;
    this.getProductData2 = this.getProductData[i];
  }

  reqEntry() {
    //showAddProd = false;
    this.prod_table = false;
    this.req_entry = true;
  }

  back() {
    //showAddProd = false;
    this.prod_table = true;
    this.req_entry = false;
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
