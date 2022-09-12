import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as vex from 'vex-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil, timeout } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AepsService } from "../aeps.service";
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { analytics } from 'firebase';
import { AuthConfig } from 'src/app/app-config';
import { AppService } from "src/app/app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Socket3Service } from "src/app/socket3.service";
import { aepsAllApi } from '../aeps.api';
import jwt_decode from 'jwt-decode';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import jspdf from 'jspdf'; 
import "../string.d.ts"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AgmMap, MapsAPILoader } from '@agm/core';
import * as io from 'src/assets/socket.io.min.js'
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-aeps',
  templateUrl: './aeps.component.html',
  styleUrls: ['./aeps.component.scss']
})
export class AepsComponent implements OnInit, AfterViewInit {
  aepsform: FormGroup;
  aepsformBE: FormGroup;
  aepsformMS: FormGroup;
  aepsformAP: FormGroup
  QScore: any = 0;
  myvalue: boolean;
  modeselect: string;
  ImagePath: string;
  errorData: any;
  matDisplaytext: boolean;
  dontShow: boolean = false;
  rblLogoUrl: any;
  banknameget: string;
  amountget: string;
  exampleItems: any = [];
  bankList: any = [];
  matchecked: boolean
  bankListBE: any = [];
  bankListMS: any = [];
  bankListAP: any = [];
  unsub = new Subject();
  valueget: any;
  datameget: any;
  radioBankName: any;
  radioBankName1: any
  radioextbankNameMS: any
  radioBankNameBE: any
  radioBankNameBE1: any
  radioBankNameMS: any
  radioBankNameMS1: any
  radioBankNameAP: any
  radioextbankNameBE: any
  radioBankNameAP1: any
  balanceEnquiryfetch: any
  radiovalueAmountAP: any
  radiovalueAmountAP1: any
  radioextbankNameCW: any
  cashwithdrawres: any
  cashwithdrawresapi: any = {
    txId: ""
  };
  ministatementresapi: any = {
    txId: ""
  }
  balanceEnquiryres: any
  ministatementres: any
  aadharpayres: any = {
    txId: ""
  }
  balanceEnquiryresapi: any = {
    txId: ""
  }
  cashwithdrawfetch: boolean
  aadhaarpay_socketdis: any
  ministatementresfetch1: boolean
  cashwithdraw_socketdis: any
  mini_thValuesBalanceFetch: any
  myxmlfetchdataMS: any
  myxmlfetchdataCW: any;
  myxmlfetchdataBE: any
  radioextbankNameAP: any
  mini_thValues: any
  balanceEnquiryresfetch: boolean
  ministatementresfetch: boolean
  Aadharpayfetch: boolean
  radioAmountData: any;
  smsaadharpayMobile: any;
  smsbalanceEnquiryMobile: any
  smscashwithdrawMobile: any
  mytabopened: string;
  myxmlfetchdata: any;
  myaadharvalidationCwadh1: any
  myaadharvalidationCwadh2: any
  myaadharvalidationCwadh3: any
  checkvalidForAadhar: boolean
  totalaadhar: any
  radioAmountData1: any;
  lat: any;
  lng: any;
  latlng: string;
  ipAddress: string;
  QScoreData: boolean;
  @ViewChild('confirmMessage', { static: false }) public confirmModal: any;
  @ViewChild('confirmMessageBE', { static: true }) public confirmModalBE: any;
  @ViewChild('confirmMessageMS', { static: false }) public confirmModalMS: any;
  @ViewChild('confirmMessageAP', { static: false }) public confirmModalAP: any;
  @ViewChild('confirmMessageAP_socket', { static: false }) public confirmModalAP_socket: any;
  @ViewChild('confirmMessageCW_socket', { static: false }) public confirmModalCW_socket: any;
  @ViewChild('confirmMessageBE_socket', { static: false }) public confirmMessageBE_socket: any;
  @ViewChild('confirmMessageMS_socket', { static: false }) public confirmMessageMS_socket: any;
  @ViewChild('confirmMessageBE_mode', { static: false }) public confirmMessageBE_mode: any;

  @ViewChild('showFingerPrintModal', { static: false }) private fingerPrintModal: any;

  cashwithdraw: any = {
    mobileNumber: "",
    aadharNo: "",
    iin: "",
    amount: "",
    bankName: "",
    ipAddress: "",
    latLong: "",
    dpId: "",
    rdsId: "",
    rdsVer: "",
    dc: "",
    mi: "",
    mcData: "",
    sKey: "",
    hMac: "",
    pidData: "",
    encryptedPID: "",
    ci: "",
    //sr_no:"",
    apiUser: "",
    freshnessFactor: "",
    shakey: "",
    gatewayPriority: ""
  };

  balanceEnquiry: any = {
    mobileNumber: "",
    aadharNo: "",
    iin: "",
    dpId: "",
    rdsId: "",
    rdsVer: "",
    dc: "",
    mi: "",
    mcData: "",
    pidData: "",
    bankName: "",
    ipAddress: "",
    latLong: "",
    sKey: "",
    hMac: "",
    encryptedPID: "",
    ci: "",
    //sr_no:"",
    apiUser: "",
    freshnessFactor: "",
    shakey: "",
    gatewayPriority: ""
  };

  ministatement: any = {
    mobileNumber: "",
    aadharNo: "",
    iin: "",
    amount: "",
    dpId: "",
    rdsId: "",
    rdsVer: "",
    dc: "",
    mi: "",
    mcData: "",
    sKey: "",
    hMac: "",
    pidData: "",
    bankName: "",
    ipAddress: "",
    latLong: "",
    encryptedPID: "",
    ci: "",
    //sr_no:"",
    apiUser: "",
    freshnessFactor: "",
    shakey: "",
    gatewayPriority: ""
  };


  aadharPay: any = {
    mobileNumber: "",
    aadharNo: "",
    iin: "",
    bankName: "",
    amount: "",
    dpId: "",
    rdsId: "",
    rdsVer: "",
    dc: "",
    mi: "",
    mcData: "",
    pidData: "",
    sKey: "",
    hMac: "",
    encryptedPID: "",
    ci: "",
    //sr_no:"",
    apiUser: "",
    latLong: "",
    freshnessFactor: "",
    shakey: ""
  };
  myxmldata: any;
  fingerData: any = {
    mobileNumber: "",
    aadharNo: "",
    iin: "",
    amount: "",
    bankName: "",
    ipAddress: "",
    latLong: "",
    dpId: "",
    rdsId: "",
    rdsVer: "",
    dc: "",
    mi: "",
    mcData: "",
    sKey: "",
    hMac: "",
    pidData: "",
    encryptedPID: "",
    ci: "",
    apiUser: "",
    freshnessFactor: "",
    shakey: "",
    gatewayPriority: ""
  };
  tab_val: any;
  mini_thValues1: any;
  mini_thValuesBalanceFetch1: any;
  tid: any;
  bal: any;
  bnk: any;
  origin: any;
  bnkName: any;
  txn_id: any;
  crt_dt: any;
  ministatementresfetch_mode: boolean;
  pdfHd: any;
  amount_cw: any;
  amount_ap: any;
  validAmount: boolean;
  validAmountAp: boolean;
  val: any;
  val1: any;
  val2: any;
  vid_be: boolean;
  vid_ms: boolean;
  vid_cw: boolean;


  constructor(private firestore: AngularFirestore,
    private aepsservice: AepsService,
    private ngxSpinner: NgxSpinnerService,
    private apiloader: MapsAPILoader,
    private http: HttpClient,
    private socketService3: Socket3Service,
    private appService: AppService
  ) {
    (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
    this.ministatementresfetch_mode = false;
    //this.matDisplaytext=false;
    //console.log(this.exampleItems)



    this.ipload();
    this.checkvalidForAadhar = true;
    this.rblLogoUrl = ""

    navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.latlng = `${this.lat},${this.lng}`
    });

    this.modeselect = "option1";
    //vex.dialog.alert(`Server Error`);
    //this.ImagePath = '../../../../assets/images/mantra.svg'

    this.mytabopened = "Cash Withdraw";
    this.balanceEnquiryresfetch = false;
    this.ministatementresfetch = false;
    this.Aadharpayfetch = false;

    this.aepsform = new FormGroup({
      bankname: new FormControl(''),
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[6-9][0-9]{9}$/)]),
      cwadh1: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh2: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh3: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      amountdetails: new FormControl('', [Validators.required]),
      bankinfo: new FormControl('', null),
      vid_no: new FormControl('', null),
    })


    this.aepsformBE = new FormGroup({
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[6-9][0-9]{9}$/)]),
      cwadh1: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh2: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh3: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      bankname: new FormControl('', null),
      bankinfo: new FormControl('', null),
      vid_no: new FormControl('', null),
    })


    this.aepsformMS = new FormGroup({
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[6-9][0-9]{9}$/)]),
      cwadh1: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh2: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh3: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      bankname: new FormControl('', null),
      bankinfo: new FormControl('', null),
      vid_no: new FormControl('', null),
    })

    this.aepsformAP = new FormGroup({
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[6-9][0-9]{9}$/)]),
      cwadh1: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh2: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh3: new FormControl('', [Validators.pattern(/^[0-9]{4,}$/)]),
      bankname: new FormControl('', null),
      amountdetails: new FormControl('', [Validators.required]),
      bankinfo: new FormControl('', null),
    })

    this.firestore.collection('IIN').snapshotChanges().subscribe(
      res => {
        if (res) {

          res.forEach((doc: any) => {
            //console.log(doc.payload.doc.Df.sn.proto.mapValue.fields.IIN.stringValue);
            this.exampleItems.push({ BANKNAME: doc.payload.doc.Df.key.path.segments[6], IIN: doc.payload.doc.Df.sn.proto.mapValue.fields.IIN.stringValue });
            this.bankList = this.exampleItems;
          })

          console.log(this.exampleItems);
        } else {
          console.log('Firebase collection Error');
        }
      },
      err => console.log('Firebase Error: ', err)
    );

  }

  reset_be_obj() {
    Object.keys(this.balanceEnquiry).forEach(key => {
      this.balanceEnquiry[key] = null;
    });
  };

  reset_cw_obj() {
    Object.keys(this.cashwithdraw).forEach(key => {
      this.cashwithdraw[key] = null;
    });
  };
  reset_ms_obj() {
    Object.keys(this.ministatement).forEach(key => {
      this.ministatement[key] = null;
    });
  };


  change_mode = (e) => {
    console.log(e);
    this.QScoreData = false;
    if (this.tab_val == "Balance Enquiry") {
      this.reset_cw_obj();
      this.reset_ms_obj();
      if (e.checked == true) {
        this.vid_be = true;
        this.aepsformBE.get('vid_no').setValidators(Validators.required);
        this.aepsformBE.controls['cwadh1'].clearValidators();
        this.aepsformBE.controls['cwadh2'].clearValidators();
        this.aepsformBE.controls['cwadh3'].clearValidators();
      } else {
        this.vid_be = false;
        this.aepsformBE.get('cwadh1').setValidators(Validators.required);
        this.aepsformBE.get('cwadh2').setValidators(Validators.required);
        this.aepsformBE.get('cwadh3').setValidators(Validators.required);
        this.aepsformBE.get('vid_no').clearValidators();
      }
      this.aepsformBE.get('vid_no').updateValueAndValidity();
      this.aepsformBE.get('cwadh1').updateValueAndValidity();
      this.aepsformBE.get('cwadh2').updateValueAndValidity();
      this.aepsformBE.get('cwadh3').updateValueAndValidity();
    } else if (this.tab_val == "Ministatement") {
      this.reset_cw_obj();
      this.reset_be_obj();
      if (e.checked == true) {
        this.vid_ms = true;
        this.aepsformMS.get('vid_no').setValidators(Validators.required);
        this.aepsformMS.controls['cwadh1'].clearValidators();
        this.aepsformMS.controls['cwadh2'].clearValidators();
        this.aepsformMS.controls['cwadh3'].clearValidators();
      } else {
        this.vid_ms = false;
        this.aepsformMS.get('cwadh1').setValidators(Validators.required);
        this.aepsformMS.get('cwadh2').setValidators(Validators.required);
        this.aepsformMS.get('cwadh3').setValidators(Validators.required);
        this.aepsformMS.get('vid_no').clearValidators();
      }
      this.aepsformMS.get('vid_no').updateValueAndValidity();
      this.aepsformMS.get('cwadh1').updateValueAndValidity();
      this.aepsformMS.get('cwadh2').updateValueAndValidity();
      this.aepsformMS.get('cwadh3').updateValueAndValidity();
    } else {
      this.reset_be_obj();
      this.reset_ms_obj();
      if (e.checked == true) {
        this.vid_cw = true;
        this.aepsform.get('vid_no').setValidators(Validators.required);
        this.aepsform.controls['cwadh1'].clearValidators();
        this.aepsform.controls['cwadh2'].clearValidators();
        this.aepsform.controls['cwadh3'].clearValidators();
      } else {
        this.vid_cw = false;
        this.aepsform.get('cwadh1').setValidators(Validators.required);
        this.aepsform.get('cwadh2').setValidators(Validators.required);
        this.aepsform.get('cwadh3').setValidators(Validators.required);
        this.aepsform.get('vid_no').clearValidators();
      }
      this.aepsform.get('vid_no').updateValueAndValidity();
      this.aepsform.get('cwadh1').updateValueAndValidity();
      this.aepsform.get('cwadh2').updateValueAndValidity();
      this.aepsform.get('cwadh3').updateValueAndValidity();
    }
  }


  /*  const headerDict = {
     'Content-Type': 'application/json',
     'Accept': 'application/json',
     'Access-Control-Allow-Headers': 'Content-Type',
   }
 
   const requestOptions = {
     headers: new HttpHeaders(headerDict),
   }; */


  async ipload() {
    const encodeUrl = await AuthConfig.config.encodeUrl(aepsAllApi.url.ipdata);
    this.http.get(encodeUrl).subscribe(
      res => {
        console.log(res);
      })
  }

  cwReset(form: NgForm) {
    form.resetForm();
    this.banknameget = null;
    this.banknameget = "";
    this.cashwithdraw.dpId = "";
    this.cashwithdraw.rdsId = "";
    this.cashwithdraw.rdsVer = "";
    this.cashwithdraw.dc = "";
    this.cashwithdraw.mi = "";
    this.cashwithdraw.mcData = "";
    this.cashwithdraw.sKey = "";
    this.cashwithdraw.hMac = "";
    this.cashwithdraw.encryptedPID = "";
    this.cashwithdraw.ci = "";
    this.cashwithdraw.apiUser = "";
    this.cashwithdraw.freshnessFactor = "";
    this.cashwithdraw.shakey = "";
    this.QScore = 0;
  }


  beReset(form: NgForm) {
    form.resetForm();
    this.balanceEnquiry.dpId = "";
    this.balanceEnquiry.rdsId = "";
    this.balanceEnquiry.rdsVer = "";
    this.balanceEnquiry.dc = "";
    this.balanceEnquiry.mi = "";
    this.balanceEnquiry.mcData = "";
    this.balanceEnquiry.sKey = "";
    this.balanceEnquiry.hMac = "";
    this.balanceEnquiry.encryptedPID = "";
    this.balanceEnquiry.ci = "";
    this.balanceEnquiry.apiUser = "";
    this.balanceEnquiry.freshnessFactor = "";
    this.balanceEnquiry.shakey = "";
    this.QScore = 0;
  }

  msReset(form: NgForm) {
    form.resetForm();
    //this.aepsformMS.reset();
    this.ministatement.dpId = "";
    this.ministatement.rdsId = "";
    this.ministatement.rdsVer = "";
    this.ministatement.dc = "";
    this.ministatement.mi = "";
    this.ministatement.mcData = "";
    this.ministatement.sKey = "";
    this.ministatement.hMac = "";
    this.ministatement.encryptedPID = "";
    this.ministatement.ci = "";
    this.ministatement.apiUser = "";
    this.ministatement.freshnessFactor = "";
    this.ministatement.shakey = "";
    this.QScore = 0;

  }

  apReset(form: NgForm) {
    form.resetForm();
    this.aadharPay.dpId = "";
    this.aadharPay.rdsId = "";
    this.aadharPay.rdsVer = "";
    this.aadharPay.dc = "";
    this.aadharPay.mi = "";
    this.aadharPay.mcData = "";
    this.aadharPay.sKey = "";
    this.aadharPay.hMac = "";
    this.aadharPay.encryptedPID = "";
    this.aadharPay.ci = "";
    this.aadharPay.apiUser = "";
    this.aadharPay.freshnessFactor = "";
    this.aadharPay.shakey = "";
    this.QScore = 0;
  }

  tabclick(datavalue) {
    this.banknameget = null;
    console.log(datavalue.tab.textLabel);
    this.mytabopened = datavalue.tab.textLabel;
    if (this.mytabopened === 'Balance Enquiry') {
      this.checkvalidForAadhar = true;
      this.banknameget = null;
      this.aepsform.reset();
      this.aepsformMS.reset();
      this.aepsformAP.reset();
      this.amountget = "";
      this.ministatement.dpId = "";
      this.cashwithdraw.rdsId = "";
      this.cashwithdraw.rdsVer = "";
      this.cashwithdraw.dc = "";
      this.cashwithdraw.mi = "";
      this.cashwithdraw.mcData = "";
      this.cashwithdraw.sKey = "";
      this.cashwithdraw.hMac = "";
      this.cashwithdraw.encryptedPID = "";
      this.cashwithdraw.ci = "";
      this.cashwithdraw.apiUser = "";
      this.cashwithdraw.freshnessFactor = "";
      this.cashwithdraw.shakey = "";
      this.QScore = 0;
    }
    else if (this.mytabopened === 'Cash Withdraw') {
      this.checkvalidForAadhar = true;
      this.aepsformBE.reset();
      this.aepsformMS.reset();
      this.aepsformAP.reset();
      this.balanceEnquiry.dpId = "";
      this.balanceEnquiry.rdsId = "";
      this.balanceEnquiry.rdsVer = "";
      this.balanceEnquiry.dc = "";
      this.balanceEnquiry.mi = "";
      this.balanceEnquiry.mcData = "";
      this.balanceEnquiry.sKey = "";
      this.balanceEnquiry.hMac = "";
      this.balanceEnquiry.encryptedPID = "";
      this.balanceEnquiry.ci = "";
      this.balanceEnquiry.apiUser = "";
      this.balanceEnquiry.freshnessFactor = "";
      this.balanceEnquiry.shakey = "";
      this.QScore = 0;
    }
    else if (this.mytabopened === 'Ministatement') {
      this.checkvalidForAadhar = true;
      this.aepsform.reset();
      this.aepsformBE.reset();
      this.aepsformAP.reset();
      this.amountget = "";
      this.balanceEnquiry.dpId = "";
      this.balanceEnquiry.rdsId = "";
      this.balanceEnquiry.rdsVer = "";
      this.balanceEnquiry.dc = "";
      this.balanceEnquiry.mi = "";
      this.balanceEnquiry.mcData = "";
      this.balanceEnquiry.sKey = "";
      this.balanceEnquiry.hMac = "";
      this.balanceEnquiry.encryptedPID = "";
      this.balanceEnquiry.ci = "";
      this.balanceEnquiry.apiUser = "";
      this.balanceEnquiry.freshnessFactor = "";
      this.balanceEnquiry.shakey = "";
      this.QScore = 0;
    }

    else if (this.mytabopened === 'Aadhaar Pay') {
      this.checkvalidForAadhar = true;
      this.aepsform.reset();
      this.aepsformBE.reset();
      this.aepsformMS.reset();
      this.amountget = "";
      this.aadharPay.dpId = "";
      this.aadharPay.rdsId = "";
      this.aadharPay.rdsVer = "";
      this.aadharPay.dc = "";
      this.aadharPay.mi = "";
      this.aadharPay.mcData = "";
      this.aadharPay.sKey = "";
      this.aadharPay.hMac = "";
      this.aadharPay.encryptedPID = "";
      this.aadharPay.ci = "";
      this.aadharPay.apiUser = "";
      this.aadharPay.freshnessFactor = "";
      this.aadharPay.shakey = "";
      this.QScore = 0;
    }

  }

  public inputValidator(event: any) {
    console.log(event.inputType)
    const pattern = /^[0-9]{4}$/;
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      console.log(event.target.value);
      if (event.target.value > 4) {
        event.target.value = event.target.value.substring(0, 4);
        this.myaadharvalidationCwadh1 = "";
      }
    }
    if (event.target.value.length == 4) {
      $('#cwadh2').focus()
      this.myaadharvalidationCwadh1 = event.target.value;
      if (typeof (this.myaadharvalidationCwadh2) !== "undefined" && typeof (this.myaadharvalidationCwadh3) !== "undefined") {
        if (this.myaadharvalidationCwadh2 != "" && this.myaadharvalidationCwadh3 !== "") {
          this.totalaadhar = `${this.myaadharvalidationCwadh1}${this.myaadharvalidationCwadh2}${this.myaadharvalidationCwadh3}`;
          console.log(this.totalaadhar);
          this.checkvalidForAadhar = this.totalaadhar.verhoeffCheck();
          console.log(this.checkvalidForAadhar);
        }
      }

    }

  }

  change_modal = () => {
    this.fingerPrintModal.show();
  }

  public inputValidator1(event: any) {
    //console.log(event.target.value);
    const pattern = /^[0-9]{4}$/;
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      if (event.target.value.length > 4) {
        event.target.value = event.target.value.substring(0, 4);
        this.myaadharvalidationCwadh2 = "";
      }
    }

    if (event.target.value.length == 4) {
      $('#cwadh3').focus()
      this.myaadharvalidationCwadh2 = event.target.value;
      if (typeof (this.myaadharvalidationCwadh1) !== "undefined" && typeof (this.myaadharvalidationCwadh3) !== "undefined") {
        if (this.myaadharvalidationCwadh2 != "" && this.myaadharvalidationCwadh3 !== "") {
          this.totalaadhar = `${this.myaadharvalidationCwadh1}${this.myaadharvalidationCwadh2}${this.myaadharvalidationCwadh3}`;
          console.log(this.totalaadhar);
          this.checkvalidForAadhar = this.totalaadhar.verhoeffCheck();
          console.log(this.checkvalidForAadhar);
        }
      }
    }
    else if (event.inputType === 'deleteContentBackward' && event.target.value.length == 0) {
      $('#cwadh1').focus()
      this.myaadharvalidationCwadh2 = "";
      this.checkvalidForAadhar = true;
    }

  }

  public inputValidator2(event: any) {
    //console.log(event.target.value);
    if (event.target.value.length == 4) {
      this.myaadharvalidationCwadh3 = event.target.value;
      if (typeof (this.myaadharvalidationCwadh1) !== "undefined" && typeof (this.myaadharvalidationCwadh2) !== "undefined") {
        this.totalaadhar = `${this.myaadharvalidationCwadh1}${this.myaadharvalidationCwadh2}${this.myaadharvalidationCwadh3}`;
        console.log(this.totalaadhar);
        this.checkvalidForAadhar = this.totalaadhar.verhoeffCheck();
        console.log(this.checkvalidForAadhar);
      }

    }
    else {
      this.myaadharvalidationCwadh3 = "";
    }

    const pattern = /^[0-9]{4}$/;
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      if (event.target.value > 4) {
        event.target.value = event.target.value.substring(0, 4);
      }
      else if (event.inputType === 'deleteContentBackward' && event.target.value.length == 0) {
        $('#cwadh2').focus()
        this.checkvalidForAadhar = true;
      }

    }

  }

  ngAfterViewInit() {
    // this.aepsform.get('bankname').valueChanges
    //   .pipe(takeUntil(this.unsub))
    //   .subscribe(
    //     val => {
    //       this.bankList = this.exampleItems.filter(bName => bName.BANKNAME.toLowerCase().includes(val));

    //     }

    //   );

    // this.aepsformBE.get('bankname').valueChanges
    //   .pipe(takeUntil(this.unsub))
    //   .subscribe(
    //     val => {
    //       this.bankListBE = this.exampleItems.filter(bName => bName.BANKNAME.toLowerCase().includes(val));

    //     }

    //   );

    // this.aepsformMS.get('bankname').valueChanges
    //   .pipe(takeUntil(this.unsub))
    //   .subscribe(
    //     val => {
    //       this.bankListMS = this.exampleItems.filter(bName => bName.BANKNAME.toLowerCase().includes(val));

    //     }

    //   );

    // this.aepsformAP.get('bankname').valueChanges
    //   .pipe(takeUntil(this.unsub))
    //   .subscribe(
    //     val => {
    //       this.bankListAP = this.exampleItems.filter(bName => bName.BANKNAME.toLowerCase().includes(val));

    //     }

    //   );

  }

  searhBankNameCW = (e) => {
    console.log(e);
    e = e.toLowerCase();
    this.bankList = this.exampleItems.filter(bName => bName.BANKNAME.toLowerCase().startsWith(e));
  }
  searhBankNameBE = (e) => {
    console.log(e);
    e = e.toLowerCase();
    this.bankListBE = this.exampleItems.filter(bName => bName.BANKNAME.toLowerCase().startsWith(e));
  }
  searhBankNameMS = (e) => {
    console.log(e);
    e = e.toLowerCase();
    this.bankListMS = this.exampleItems.filter(bName => bName.BANKNAME.toLowerCase().startsWith(e));
  }

  displayFn(product): string {
    return product ? product.BANKNAME : product;
  }
  radiovalue(data) {
    this.radioBankName1 = data;
    console.log(this.aepsform, "khwaja");

    this.aepsform.get('bankname').setValue(".");
    let x = this.aepsform.get('bankname').value.IIN
    if (data != 606985 || x != 607280 || x !=606993) {
      
      this.validAmount = false;
    }
    // this.aepsform.get('bankname').reset();
  }

  radiovalueBE(data) {
    this.radioBankNameBE1 = data;
    this.aepsformBE.get('bankname').setValue(".");
  }

  radiovalueMS(data) {
    this.radioBankNameMS1 = data;
    this.aepsformMS.get('bankname').setValue(".");
  }

  radiovalueAP(data) {
    this.radioBankNameAP1 = data;

    let x = this.aepsformAP.get('bankname').value.IIN
    if (data != 606985 || x != 607280 || x !=606993) {
      
      this.validAmountAp = false;
    }
  }

  radiovalueAmount(data) {
    this.radioAmountData1 = data;
    if (data != "other1") {
      this.validAmount = false;
    }
  }
  radiovalueAmountAPfun(data) {
    this.radiovalueAmountAP1 = data;
    if (data != "other5") {
      this.validAmountAp = false;
    }
  }


  /*  bankiinGenerate()
   {
     if(this.datameget)
     {
       this.radioBankName=this.datameget.IIN;
     }
 
   } */



  sha256: any = (ascii) => {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    };

    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;

    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = this.sha256.h = this.sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = this.sha256.k = this.sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return; // ASCII check: only accept characters in range 0-255
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)

    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
      var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
      var oldHash = hash;
      // This is now the undefinedworking hash", often labelled as variables a...g
      // (we have to truncate as well, otherwise extra entries at the end accumulate
      hash = hash.slice(0, 8);

      for (i = 0; i < 64; i++) {
        var i2 = i + j;
        // Expand the message into 64 words
        // Used below if
        var w15 = w[i - 15], w2 = w[i - 2];

        // Iterate
        var a = hash[0], e = hash[4];
        var temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
          + ((e & hash[5]) ^ ((~e) & hash[6])) // ch
          + k[i]
          // Expand the message schedule if needed
          + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
          ) | 0
          );
        // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
        var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

        hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  }

  connectSocketCW() {
    this.socketService3.setupSocket();
    const socketSub = this.socketService3.socketData
      .pipe(takeUntil(this.unsub))
      .subscribe((data: any) => {
        if (data) {
          console.log('Socket Data In Aeps: ', data);
          this.cashwithdrawres = data;
          setTimeout(() => {
            // this.appService.fetchWalletBalance();
          }, 2000);
          this.ngxSpinner.hide('elasticSpinner');
          if (this.cashwithdrawres.status === "SUCCESS") {
            this.aepsform.reset();
            this.cashwithdrawfetch = true;
            this.confirmModal.show();
            this.cashwithdraw.dpId = "";
            this.cashwithdraw.rdsId = "";
            this.cashwithdraw.rdsVer = "";
            this.cashwithdraw.dc = "";
            this.cashwithdraw.mi = "";
            this.cashwithdraw.mcData = "";
            this.cashwithdraw.sKey = "";
            this.cashwithdraw.hMac = "";
            this.cashwithdraw.encryptedPID = "";
            this.cashwithdraw.ci = "";
            this.QScore = 0;
          }
          else {
            this.confirmModal.show();
            this.cashwithdrawfetch = true;
            this.cashwithdraw.dpId = "";
            this.cashwithdraw.rdsId = "";
            this.cashwithdraw.rdsVer = "";
            this.cashwithdraw.dc = "";
            this.cashwithdraw.mi = "";
            this.cashwithdraw.mcData = "";
            this.cashwithdraw.sKey = "";
            this.cashwithdraw.hMac = "";
            this.cashwithdraw.encryptedPID = "";
            this.cashwithdraw.ci = "";
            this.QScore = 0;
          }

          this.ngxSpinner.hide('elasticSpinner');
          this.QScoreData = false;
          if (data.socket_timeout) {
            this.cashwithdrawfetch = false;
            console.log("socket time out before");
            console.log(data);
            console.log(this.cashwithdrawres);
            console.log(this.cashwithdrawres.txId);
            this.confirmModalCW_socket.show();
          }
          socketSub.unsubscribe();
          this.socketService3.disconnectSocket();
        }
      });
  }


  async cashwithdrawAfterSocket() {

    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    const encodeUrl = await AuthConfig.config.encodeUrl(`https://aepscomposer.iserveu.tech/transactionEnquiry/${this.cashwithdrawresapi.txId}`);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      // observe: 'response' as 'body'
    };
    this.http.post(encodeUrl, httpOptions).subscribe(
      res => {
        this.ngxSpinner.hide('elasticSpinner');
        this.cashwithdrawfetch = true;
        console.log(res);
        this.cashwithdrawres = res;
        this.confirmModal.show();
        this.aepsform.reset();
        this.QScore = 0;
        this.cashwithdraw.dpId = "";
        this.cashwithdraw.rdsId = "";
        this.cashwithdraw.rdsVer = "";
        this.cashwithdraw.dc = "";
        this.cashwithdraw.mi = "";
        this.cashwithdraw.mcData = "";
        this.cashwithdraw.sKey = "";
        this.cashwithdraw.hMac = "";
        this.cashwithdraw.encryptedPID = "";
        this.cashwithdraw.ci = "";
      },
      err => {
        this.ngxSpinner.hide('elasticSpinner');
        this.cashwithdrawfetch = true;
        console.log(err);
        vex.dialog.alert(`Some problem occoured while fetching transcation status please check the report section for transaction id - ${this.cashwithdrawres.txId}}`)
        this.QScore = 0;
        this.cashwithdraw.dpId = "";
        this.cashwithdraw.rdsId = "";
        this.cashwithdraw.rdsVer = "";
        this.cashwithdraw.dc = "";
        this.cashwithdraw.mi = "";
        this.cashwithdraw.mcData = "";
        this.cashwithdraw.sKey = "";
        this.cashwithdraw.hMac = "";
        this.cashwithdraw.encryptedPID = "";
        this.cashwithdraw.ci = "";
      }
    )

  }


  amountValidate_cw = (cw_a) => {
    if (this.radioBankName1 === 'other') {
      let x = this.aepsform.get('bankname').value.IIN;
      if (((x == '607280') || (x == '606993')) && (cw_a % 100 != 0)) {
        this.validAmount = true;
        console.log(this.validAmount);

      } else {
        this.validAmount = false;
        console.log(this.validAmount);
      }

    } else {
      if
        (((this.aepsform.get('bankinfo').value == '606985') ||
          (this.aepsform.get('bankname').value == '607280') ||
          (this.aepsform.get('bankname').value == '606993')) && (cw_a % 100 != 0)) {
        this.validAmount = true;
        console.log(this.validAmount);

      } else {
        this.validAmount = false;
        console.log(this.validAmount);
      }
    }
  }
  amountValidate_ap = (ap_a) => {
    if (this.radioBankNameAP1 === 'other5') {
      let y = this.aepsformAP.get('bankname').value.IIN;
      if
        (((y == '607280') || (y == '606993')) && (ap_a % 100 != 0)) {
        this.validAmountAp = true;
      } else {
        this.validAmountAp = false;
      }
    } else {
      if
        (((this.aepsformAP.get('bankinfo').value == '606985') ||
          (this.aepsformAP.get('bankname').value == '607280') ||
          (this.aepsformAP.get('bankname').value == '606993')) && (ap_a % 100 != 0)) {
        this.validAmountAp = true;
      } else {
        this.validAmountAp = false;
      }
    }
  }



  async submit_cashwithdraw(e) {
    // this.amount_cw = this.aepsform.get('amountdetails').value
    // if ((this.amount_cw == 1) || ((this.amount_cw)%100 == 0)) {
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    if (this.radioBankName1 === 'other') {
      this.radioBankName = this.aepsform.get('bankname').value.IIN;
      this.radioextbankNameCW = this.aepsform.get('bankname').value.BANKNAME;
      console.log(this.radioextbankNameCW);
    }
    else {
      this.radioBankName = this.radioBankName1;
    }
    if (this.radioAmountData1 === 'other1') {
      this.radioAmountData = this.aepsform.get('amountdetails').value;
    }
    else {
      this.radioAmountData = this.radioAmountData1;
    }

    if (this.radioBankName1 == 607094) {
      this.radioextbankNameCW = "State Bank of India";
    }
    else if (this.radioBankName1 == 606985) {
      this.radioextbankNameCW = "Bank of Baroda";
    }
    else if (this.radioBankName1 == 607396) {
      this.radioextbankNameCW = "Canara Bank";
    }
    else {
      this.radioextbankNameCW = this.radioextbankNameCW;
    }

    this.cashwithdraw.mobileNumber = this.aepsform.get('mobileNumber').value;
    this.smscashwithdrawMobile = this.cashwithdraw.mobileNumber;
    if (this.vid_cw) {
      this.cashwithdraw.aadharNo = this.aepsform.get('vid_no').value;
    } else {
      let cwadh1 = this.aepsform.get('cwadh1').value;
      let cwadh2 = this.aepsform.get('cwadh2').value;
      let cwadh3 = this.aepsform.get('cwadh3').value;
      cwadh3 = cwadh3.length > 4 ? cwadh3.slice(0, -1) : cwadh3;
      this.cashwithdraw.aadharNo = `${cwadh1}${cwadh2}${cwadh3}`;
      // this.cashwithdraw.aadharNo = `${cwadh1}${cwadh2}${cwadh3}`;
    }
    // let cwadh1 = this.aepsform.get('cwadh1').value;
    // let cwadh2 = this.aepsform.get('cwadh2').value;
    // let cwadh3 = this.aepsform.get('cwadh3').value;
    // cwadh3 = cwadh3.length > 4 ? cwadh3.slice(0, -1) : cwadh3;
    // this.cashwithdraw.aadharNo = `${cwadh1}${cwadh2}${cwadh3}`;
    this.cashwithdraw.iin = this.radioBankName;
    this.cashwithdraw.amount = this.radioAmountData;

    if (e == 0) {
      this.cashwithdraw.pidData = this.myxmlfetchdataCW;
    } else {
      this.cashwithdraw.pidData = this.myxmldata;
      this.cashwithdraw.dpId = this.fingerData.dpId;
      this.cashwithdraw.rdsId = this.fingerData.rdsId;
      this.cashwithdraw.rdsVer = this.fingerData.rdsVer;
      this.cashwithdraw.dc = this.fingerData.dc;
      this.cashwithdraw.mi = this.fingerData.mi;
      this.cashwithdraw.mcData = this.fingerData.mcData;
      this.cashwithdraw.sKey = this.fingerData.sKey;
      this.cashwithdraw.hMac = this.fingerData.hMac;
      this.cashwithdraw.encryptedPID = this.fingerData.encryptedPID;
      this.cashwithdraw.ci = this.fingerData.ci;
      this.cashwithdraw.iin = this.radioBankName;
    }

    this.cashwithdraw.latLong = this.latlng;
    this.cashwithdraw.bankName = this.radioextbankNameCW;
    this.cashwithdraw.ipAddress = "106.222.173.232";
    this.cashwithdraw.apiUser = "WEBUSER";
    this.cashwithdraw.freshnessFactor = "default";
    this.cashwithdraw.operation = "WITHDRAW";
    this.cashwithdraw.gatewayPriority = e;
    console.log(this.sha256(this.cashwithdraw.aadharNo));
    this.cashwithdraw.shakey = this.sha256(this.cashwithdraw.aadharNo);
    //console.log(this.sha256(this.cashwithdraw.aadharNo));
    console.log(this.cashwithdraw);
    const encodeUrl = await AuthConfig.config.encodeUrl(aepsAllApi.url.cashwithdraw);

    if (parseInt(this.radioBankName)) {
      this.aepsservice.cashwithdraw(encodeUrl, this.cashwithdraw).pipe(timeout(60 * 1000)).subscribe(
        (res: any) => {
          console.log(res);
          this.cashwithdrawresapi = res;

            this.cashwithdrawres = res;
            setTimeout(() => {
              // this.appService.fetchWalletBalance();
            }, 2000);
            this.ngxSpinner.hide('elasticSpinner');
            if (this.cashwithdrawres.status === "SUCCESS") {
              this.aepsform.reset();
              this.cashwithdrawfetch = true;
              this.confirmModal.show();
              this.cashwithdraw.dpId = "";
              this.cashwithdraw.rdsId = "";
              this.cashwithdraw.rdsVer = "";
              this.cashwithdraw.dc = "";
              this.cashwithdraw.mi = "";
              this.cashwithdraw.mcData = "";
              this.cashwithdraw.sKey = "";
              this.cashwithdraw.hMac = "";
              this.cashwithdraw.encryptedPID = "";
              this.cashwithdraw.ci = "";
              this.QScore = 0;
            }
            else {
              this.confirmModal.show();
              this.cashwithdrawfetch = true;
              this.cashwithdraw.dpId = "";
              this.cashwithdraw.rdsId = "";
              this.cashwithdraw.rdsVer = "";
              this.cashwithdraw.dc = "";
              this.cashwithdraw.mi = "";
              this.cashwithdraw.mcData = "";
              this.cashwithdraw.sKey = "";
              this.cashwithdraw.hMac = "";
              this.cashwithdraw.encryptedPID = "";
              this.cashwithdraw.ci = "";
              this.QScore = 0;
            }
  
            this.ngxSpinner.hide('elasticSpinner');
            this.QScoreData = false;
            
          
          // this.connectSocketCW();
          //this.confirmModal.show();
          //this.ngxSpinner.hide('elasticSpinner');
        },
        (err: any) => {
          if (err.name == 'TimeoutError') {
            this.connectSocketCW();
          } else {
            vex.dialog.alert(err);
            this.cashwithdrawresapi = err.error;
            this.ngxSpinner.hide('elasticSpinner');
          }
          // vex.dialog.alert(err.error.transactionStatus);
          console.log(this.cashwithdraw, "obj data");
          // this.cashwithdraw = {};

          this.QScore = 0;
          this.QScoreData = false;

          this.cashwithdraw.dpId = "";
          this.cashwithdraw.rdsId = "";
          this.cashwithdraw.rdsVer = "";
          this.cashwithdraw.dc = "";
          this.cashwithdraw.mi = "";
          this.cashwithdraw.mcData = "";
          this.cashwithdraw.sKey = "";
          this.cashwithdraw.hMac = "";
          this.cashwithdraw.encryptedPID = "";
          this.cashwithdraw.ci = "";
          vex.dialog.alert(err.error.apiComment);
          this.socketService3.disconnectSocket();
          //this.confirmModal.show();
          this.cashwithdrawresapi = err.error;
          this.ngxSpinner.hide('elasticSpinner');
          console.log(err);
        }
      );
    }
    else {
      vex.dialog.alert("Please Select bank Name");
      this.ngxSpinner.hide('elasticSpinner');
    }
    // } else {
    //       vex.dialog.alert("Please enter value of Rs 1 or in multiples of Rs 100");
    //       this.QScore = 0;
    //       this.QScoreData = false;
    //       this.cashwithdraw.dpId = "";
    //       this.cashwithdraw.rdsId = "";
    //       this.cashwithdraw.rdsVer = "";
    //       this.cashwithdraw.dc = "";
    //       this.cashwithdraw.mi = "";
    //       this.cashwithdraw.mcData = "";
    //       this.cashwithdraw.sKey = "";
    //       this.cashwithdraw.hMac = "";
    //       this.cashwithdraw.encryptedPID = "";
    //       this.cashwithdraw.ci = "";
    //     }
  }


  connectSocketBE() {
    this.socketService3.setupSocket();

    const socketSub = this.socketService3.socketData
      .pipe(takeUntil(this.unsub))
      .subscribe((data: any) => {
        if (data) {
          console.log('Socket Data In Aeps: ', data);
          this.balanceEnquiryres = data;
          // console.log(this.balanceEnquiryres, 'balanceEnquiryres In Aeps: ');
          this.tid = this.balanceEnquiryres.apiTid;
          this.bal = this.balanceEnquiryres.balance;
          this.bnk = this.balanceEnquiryres.bankName;
          console.log(this.balanceEnquiryres, "hi khwaja");

          this.origin = this.balanceEnquiryres.origin_identifier;
          this.bnkName = this.balanceEnquiryres.bankName;
          this.txn_id = this.balanceEnquiryres.txId;
          this.crt_dt = this.balanceEnquiryres.createdDate;

          console.log(this.origin, this.bnkName, this.txn_id, this.crt_dt, "hi khwaja 1...");




          if (this.balanceEnquiryres.status === "SUCCESS") {
            this.aepsformBE.reset();
            this.balanceEnquiryfetch = true;
            if (this.balanceEnquiryres.transactionMode == "AEPS_MINI_STATEMENT") {
              // this.pdfHd = "AEPS MINI STATEMENT.";
              this.ministatementresfetch_mode = true;
              this.mini_thValues1 = JSON.parse(this.balanceEnquiryres.account_balance);
              this.mini_thValuesBalanceFetch1 = this.mini_thValues1.balance;
              console.log(this.mini_thValuesBalanceFetch1, "uuuuuuuuuuuuuuuuuuuuuuuuuuu");

              this.mini_thValues1 = this.mini_thValues1.ministatement;
              this.confirmMessageBE_mode.show();
            } else if (this.balanceEnquiryres.transactionMode == "AEPS_BALANCE_ENQUIRY") {
              // this.pdfHd = "AEPS BALANCE ENQUIRY.";
              this.ministatementresfetch_mode = false;
              this.confirmModalBE.show();
            }
            this.balanceEnquiry.dpId = "";
            this.balanceEnquiry.rdsId = "";
            this.balanceEnquiry.rdsVer = "";
            this.balanceEnquiry.dc = "";
            this.balanceEnquiry.mi = "";
            this.balanceEnquiry.mcData = "";
            this.balanceEnquiry.sKey = "";
            this.balanceEnquiry.hMac = "";
            this.balanceEnquiry.encryptedPID = "";
            this.balanceEnquiry.ci = "";
            this.QScore = 0;
          }
          else {
            this.confirmModalBE.show();
            this.balanceEnquiryfetch = true;
            this.balanceEnquiry.dpId = "";
            this.balanceEnquiry.rdsId = "";
            this.balanceEnquiry.rdsVer = "";
            this.balanceEnquiry.dc = "";
            this.balanceEnquiry.mi = "";
            this.balanceEnquiry.mcData = "";
            this.balanceEnquiry.sKey = "";
            this.balanceEnquiry.hMac = "";
            this.balanceEnquiry.encryptedPID = "";
            this.balanceEnquiry.ci = "";
            this.QScore = 0;
          }

          this.ngxSpinner.hide('elasticSpinner');
          this.QScoreData = false;
          if (data.socket_timeout) {
            this.balanceEnquiryfetch = false;
            console.log("socket time out before");
            console.log(data);
            console.log(this.balanceEnquiry);
            console.log(this.aadharpayres.txId);
            this.confirmMessageBE_socket.show();
          }
          socketSub.unsubscribe();
          this.socketService3.disconnectSocket();
        }
      });
  }


  async BalanceEnquiryAfterSocket() {

    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    const encodeUrl = await AuthConfig.config.encodeUrl(`https://aepscomposer.iserveu.tech/transactionEnquiry/${this.balanceEnquiryresapi.txId}`);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      // observe: 'response' as 'body'
    };
    this.http.post(encodeUrl, httpOptions).subscribe(
      res => {
        this.ngxSpinner.hide('elasticSpinner');
        console.log(res);
        this.balanceEnquiryfetch = true;
        this.balanceEnquiryres = res;
        this.confirmModalBE.show();
        this.aepsformBE.reset();
        this.QScore = 0;
        this.balanceEnquiry.dpId = "";
        this.balanceEnquiry.rdsId = "";
        this.balanceEnquiry.rdsVer = "";
        this.balanceEnquiry.dc = "";
        this.balanceEnquiry.mi = "";
        this.balanceEnquiry.mcData = "";
        this.balanceEnquiry.sKey = "";
        this.balanceEnquiry.hMac = "";
        this.balanceEnquiry.encryptedPID = "";
        this.balanceEnquiry.ci = "";
      },
      err => {
        this.ngxSpinner.hide('elasticSpinner');
        this.balanceEnquiryres = false;
        console.log(err);
        vex.dialog.alert(`Some problem occoured while fetching transcation status please check the report section for transaction id - ${this.balanceEnquiryresapi.txId}}`)
        this.QScore = 0;
        this.cashwithdraw.dpId = "";
        this.cashwithdraw.rdsId = "";
        this.cashwithdraw.rdsVer = "";
        this.cashwithdraw.dc = "";
        this.cashwithdraw.mi = "";
        this.cashwithdraw.mcData = "";
        this.cashwithdraw.sKey = "";
        this.cashwithdraw.hMac = "";
        this.cashwithdraw.encryptedPID = "";
        this.cashwithdraw.ci = "";
      }
    )

  }



  async submit_balance_Enquiry(e) {
    //this.connectSocketBE();
    //this.confirmModal.show();
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    if (this.radioBankNameBE1 === 'other2') {
      this.radioBankNameBE = this.aepsformBE.get('bankname').value.IIN;
      this.radioextbankNameBE = this.aepsformBE.get('bankname').value.BANKNAME;
      console.log(this.radioBankNameBE)
    }
    else {
      this.radioBankNameBE = this.radioBankNameBE1;
    }
    //this.radioextbankNameBE=this.aepsformBE.get('bankname').value.BANKNAME;
    if (this.radioBankNameBE1 == 607094) {
      this.radioextbankNameBE = "State Bank of India";
    }
    else if (this.radioBankNameBE1 == 606985) {
      this.radioextbankNameBE = "Bank of Baroda";
    }
    else if (this.radioBankNameBE1 == 607396) {
      this.radioextbankNameBE = "Canara Bank";
    }
    else {
      this.radioextbankNameBE = this.aepsformBE.get('bankname').value.BANKNAME;
    }

    this.balanceEnquiry.mobileNumber = this.aepsformBE.get('mobileNumber').value;
    this.smsbalanceEnquiryMobile = this.balanceEnquiry.mobileNumber;

    if (this.vid_be) {
      this.balanceEnquiry.aadharNo = this.aepsformBE.get('vid_no').value;
    } else {
      let cwadhBE1 = this.aepsformBE.get('cwadh1').value;
      let cwadhBE2 = this.aepsformBE.get('cwadh2').value;
      let cwadhBE3 = this.aepsformBE.get('cwadh3').value;
      cwadhBE3 = cwadhBE3.length > 4 ? cwadhBE3.slice(0, -1) : cwadhBE3;
      this.balanceEnquiry.aadharNo = `${cwadhBE1}${cwadhBE2}${cwadhBE3}`;
        }
    // let cwadhBE1 = this.aepsformBE.get('cwadh1').value;
    // let cwadhBE2 = this.aepsformBE.get('cwadh2').value;
    // let cwadhBE3 = this.aepsformBE.get('cwadh3').value;
    // cwadhBE3 = cwadhBE3.length > 4 ? cwadhBE3.slice(0, -1) : cwadhBE3;
    // this.balanceEnquiry.aadharNo = `${cwadhBE1}${cwadhBE2}${cwadhBE3}`;
    this.balanceEnquiry.iin = this.radioBankNameBE;

    if (e == 0) {
      this.balanceEnquiry.pidData = this.myxmlfetchdataBE;
    } else {
      this.balanceEnquiry.pidData = this.myxmldata;
      this.balanceEnquiry.dpId = this.fingerData.dpId;
      this.balanceEnquiry.rdsId = this.fingerData.rdsId;
      this.balanceEnquiry.rdsVer = this.fingerData.rdsVer;
      this.balanceEnquiry.dc = this.fingerData.dc;
      this.balanceEnquiry.mi = this.fingerData.mi;
      this.balanceEnquiry.mcData = this.fingerData.mcData;
      this.balanceEnquiry.sKey = this.fingerData.sKey;
      this.balanceEnquiry.hMac = this.fingerData.hMac;
      this.balanceEnquiry.encryptedPID = this.fingerData.encryptedPID;
      this.balanceEnquiry.ci = this.fingerData.ci;
      this.balanceEnquiry.iin = this.radioBankNameBE;
    }
    this.balanceEnquiry.bankName = this.radioextbankNameBE;
    this.balanceEnquiry.ipAddress = "106.222.173.232";
    this, this.balanceEnquiry.latLong = this.latlng;
    this.balanceEnquiry.apiUser = "WEBUSER";
    this.balanceEnquiry.freshnessFactor = "default";
    this.balanceEnquiry.operation = "WITHDRAW";
    this.balanceEnquiry.gatewayPriority = e;
    console.log(this.sha256(this.balanceEnquiry.aadharNo));
    this.balanceEnquiry.shakey = this.sha256(this.balanceEnquiry.aadharNo);
    //console.log(this.sha256(this.cashwithdraw.aadharNo));
    console.log(this.balanceEnquiry);
    const encodeUrlBE = await AuthConfig.config.encodeUrl(aepsAllApi.url.balanceEnquiry);

    if (parseInt(this.radioBankNameBE)) {
      this.aepsservice.balanceEnquiry(encodeUrlBE, this.balanceEnquiry).pipe(timeout(60 * 1000)).subscribe(
        (res: any) => {
          // this.connectSocketBE();
          console.log(res);
          this.balanceEnquiryresapi = res;
          console.log(this.balanceEnquiryresapi);
          this.balanceEnquiryresfetch = true;
          this.ngxSpinner.hide('elasticSpinner');
          //console.log(this.balanceEnquiryres);
          //this.confirmModalBE.show();

          this.balanceEnquiryres = res;
          this.tid = this.balanceEnquiryres.apiTid;
          this.bal = this.balanceEnquiryres.balance;
          this.bnk = this.balanceEnquiryres.bankName;
          console.log(this.balanceEnquiryres, "hi khwaja");
          this.origin = this.balanceEnquiryres.origin_identifier;
          this.bnkName = this.balanceEnquiryres.bankName;
          this.txn_id = this.balanceEnquiryres.txId;
          this.crt_dt = this.balanceEnquiryres.createdDate;
          console.log(this.origin, this.bnkName, this.txn_id, this.crt_dt, "hi khwaja 1...");
          if (this.balanceEnquiryres.status === "SUCCESS") {
            this.aepsformBE.reset();
            this.balanceEnquiryfetch = true;
            if (this.balanceEnquiryres.transactionMode == "AEPS_MINI_STATEMENT") {
              this.ministatementresfetch_mode = true;
              this.mini_thValues1 = this.balanceEnquiryres.ministatement;
              // this.mini_thValues1 = this.balanceEnquiryres.balance;
              this.mini_thValuesBalanceFetch1 = this.balanceEnquiryres.balance;
              console.log(this.mini_thValuesBalanceFetch1, "uuuuuuuuuuuuuuuuuuuuuuuuuuu");

              // this.mini_thValues1 = this.mini_thValues1.ministatement;
              this.confirmMessageBE_mode.show();
            } else if (this.balanceEnquiryres.transactionMode == "AEPS_BALANCE_ENQUIRY") {
              this.ministatementresfetch_mode = false;
              this.confirmModalBE.show();
            }
            this.balanceEnquiry.dpId = "";
            this.balanceEnquiry.rdsId = "";
            this.balanceEnquiry.rdsVer = "";
            this.balanceEnquiry.dc = "";
            this.balanceEnquiry.mi = "";
            this.balanceEnquiry.mcData = "";
            this.balanceEnquiry.sKey = "";
            this.balanceEnquiry.hMac = "";
            this.balanceEnquiry.encryptedPID = "";
            this.balanceEnquiry.ci = "";
            this.QScore = 0;
          }
          else {
            this.confirmModalBE.show();
            this.balanceEnquiryfetch = true;
            this.balanceEnquiry.dpId = "";
            this.balanceEnquiry.rdsId = "";
            this.balanceEnquiry.rdsVer = "";
            this.balanceEnquiry.dc = "";
            this.balanceEnquiry.mi = "";
            this.balanceEnquiry.mcData = "";
            this.balanceEnquiry.sKey = "";
            this.balanceEnquiry.hMac = "";
            this.balanceEnquiry.encryptedPID = "";
            this.balanceEnquiry.ci = "";
            this.QScore = 0;
          }

          this.ngxSpinner.hide('elasticSpinner');
          this.QScoreData = false;





        },
        (err: any) => {
          console.log(err);
          if (err.name == 'TimeoutError') {
            this.connectSocketBE();
          } else {
            vex.dialog.alert(err);
            this.balanceEnquiryresapi = err.error;
            this.ngxSpinner.hide('elasticSpinner');
          }
          //this.confirmModalBE.show();
          //this.balanceEnquiryresapi=err.error;
          //this.balanceEnquiryresfetch=true;
          //console.log(this.balanceEnquiryres);
          this.ngxSpinner.hide('elasticSpinner');
          this.QScore = 0;
          this.balanceEnquiry.dpId = "";
          this.balanceEnquiry.rdsId = "";
          this.balanceEnquiry.rdsVer = "";
          this.balanceEnquiry.dc = "";
          this.balanceEnquiry.mi = "";
          this.balanceEnquiry.mcData = "";
          this.balanceEnquiry.sKey = "";
          this.balanceEnquiry.hMac = "";
          this.balanceEnquiry.encryptedPID = "";
          this.balanceEnquiry.ci = "";
        }
      );
    }

    else {
      vex.dialog.alert("Please Select Bank Name");
      this.ngxSpinner.hide('elasticSpinner');
    }

  }


  connectSocketMS() {
    this.socketService3.setupSocket();

    const socketSub = this.socketService3.socketData
      .pipe(takeUntil(this.unsub))
      .subscribe((data: any) => {
        if (data) {
          console.log('Socket Data In Aeps: ', data);
          this.ministatementres = data;
          if (this.ministatementres.status === "SUCCESS") {
            this.aepsformMS.reset();
            this.ministatementresfetch1 = true;
            this.ministatementresfetch = false;
            this.mini_thValues = JSON.parse(this.ministatementres.account_balance);
            this.mini_thValuesBalanceFetch = this.mini_thValues.balance;
            this.mini_thValues = this.mini_thValues.ministatement;
            this.confirmMessageMS_socket.show();
            this.ministatement.rdsId = "";
            this.ministatement.rdsVer = "";
            this.ministatement.dc = "";
            this.ministatement.mi = "";
            this.ministatement.mcData = "";
            this.ministatement.sKey = "";
            this.ministatement.hMac = "";
            this.ministatement.encryptedPID = "";
            this.ministatement.ci = "";
            this.QScore = 0;
          }
          else {

            /* let ares={"txId":"837234831757680640","apiTid":"111913033628","account_balance":"{\"balance\":\"1055.21\",\"ministatement\":[{\"Date\":\"27/04/2021\",\"Type\":\"NFI/CASH\",\"DebitCredit\":\"D\",\"Amount\":1.0},{\"Date\":\"27/04/2021\",\"Type\":\"NFI/CASH\",\"DebitCredit\":\"D\",\"Amount\":1.0},{\"Date\":\"26/04/2021\",\"Type\":\"NFS/6J49\",\"DebitCredit\":\"D\",\"Amount\":101.0},{\"Date\":\"26/04/2021\",\"Type\":\"UPI/1115\",\"DebitCredit\":\"D\",\"Amount\":599.0},{\"Date\":\"23/04/2021\",\"Type\":\"UPI/1113\",\"DebitCredit\":\"D\",\"Amount\":51.0},{\"Date\":\"20/04/2021\",\"Type\":\"UPI/1110\",\"DebitCredit\":\"D\",\"Amount\":300.0},{\"Date\":\"20/04/2021\",\"Type\":\"UPI/1110\",\"DebitCredit\":\"D\",\"Amount\":599.0},{\"Date\":\"19/04/2021\",\"Type\":\"UPI/1108\",\"DebitCredit\":\"D\",\"Amount\":538.0},{\"Date\":\"19/04/2021\",\"Type\":\"UPI/1108\",\"DebitCredit\":\"D\",\"Amount\":853.0}]}","transactionMode":"AEPS_MINI_STATEMENT","origin_identifier":"xxxx-xxxx-9680","status":"SUCCESS","statusDesc":"Mini statement has been generated successfully.","apiComment":"Mini statement has been generated successfully.","createdDate":"2021-04-29 13:22:18","updatedDate":"2021-04-29 13:22:24","balance":"1055.21","bankName":"ICICI Bank","message":"ministatement success ","bcId":488,"bc_location":"Bhubaneswar,OR","npci_tran_data":"00100207002003UID0050021000635027/04/2021 Dr 1.00 NFI/CASH27/04/2021 Dr 1.00 NFI/CASH26/04/2021 Dr 101.00 NFS/6J4926/04/2021 Dr 599.00 UPI/111523/04/2021 Dr 51.00 UPI/111320/04/2021 Dr 300.00 UPI/111020/04/2021 Dr 599.00 UPI/111019/04/2021 Dr 538.00 UPI/110819/04/2021 Dr 853.00 UPI/1108Balance 000000105521 "}
            this.mini_thValues=JSON.parse(ares.account_balance);
            this.mini_thValuesBalanceFetch=JSON.parse(ares.account_balance).balance;
            this.mini_thValues=this.mini_thValues.ministatement;*/
            this.confirmModalMS.show();
            this.ministatementresfetch = true;
            this.ministatement.dpId = "";
            this.ministatement.rdsId = "";
            this.ministatement.rdsVer = "";
            this.ministatement.dc = "";
            this.ministatement.mi = "";
            this.ministatement.mcData = "";
            this.ministatement.sKey = "";
            this.ministatement.hMac = "";
            this.ministatement.encryptedPID = "";
            this.ministatement.ci = "";
            this.QScore = 0;
          }

          this.ngxSpinner.hide('elasticSpinner');
          this.QScoreData = false;
          if (data.socket_timeout) {
            this.Aadharpayfetch = false;
            console.log("socket time out before");
            console.log(data);
            console.log(this.ministatementres);
            //console.log(this.ministatementres.txId);
            //this.confirmMessageMS_socket.show();
          }
          socketSub.unsubscribe();
          this.socketService3.disconnectSocket();
        }
      });
  }


  async submit_ministatement(e) {
    this.ministatementresfetch1 = false;
    //this.connectSocketMS();
    //this.confirmModal.show();
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    if (this.radioBankNameMS1 === 'other3') {
      this.radioBankNameMS = this.aepsformMS.get('bankname').value.IIN;
      this.radioextbankNameMS = this.aepsformMS.get('bankname').value.BANKNAME;
      console.log(this.radioBankNameMS)
    }
    else {
      this.radioBankNameMS = this.radioBankNameMS1;
    }

    if (this.radioBankNameMS1 == 607094) {
      this.radioextbankNameMS = "State Bank of India";
    }
    else if (this.radioBankNameMS1 == 606985) {
      this.radioextbankNameMS = "Bank of Baroda";
    }
    else if (this.radioBankNameMS1 == 607396) {
      this.radioextbankNameMS = "Canara Bank";
    }
    else {
      this.radioextbankNameMS = this.aepsformMS.get('bankname').value.BANKNAME;
    }


    this.ministatement.mobileNumber = this.aepsformMS.get('mobileNumber').value;

    if (this.vid_ms) {
      this.ministatement.aadharNo = this.aepsformMS.get('vid_no').value;
    } else {
      let cwadhMS1 = this.aepsformMS.get('cwadh1').value;
      let cwadhMS2 = this.aepsformMS.get('cwadh2').value;
      let cwadhMS3 = this.aepsformMS.get('cwadh3').value;
      cwadhMS3 = cwadhMS3.length > 4 ? cwadhMS3.slice(0, -1) : cwadhMS3;
      this.ministatement.aadharNo = `${cwadhMS1}${cwadhMS2}${cwadhMS3}`;
        }
    // let cwadhMS1 = this.aepsformMS.get('cwadh1').value;
    // let cwadhMS2 = this.aepsformMS.get('cwadh2').value;
    // let cwadhMS3 = this.aepsformMS.get('cwadh3').value;
    // cwadhMS3 = cwadhMS3.length > 4 ? cwadhMS3.slice(0, -1) : cwadhMS3;
    // this.ministatement.aadharNo = `${cwadhMS1}${cwadhMS2}${cwadhMS3}`;
    this.ministatement.iin = this.radioBankNameMS;

    if (e == 0) {
      this.ministatement.pidData = this.myxmlfetchdataMS;
    } else {
      this.ministatement.pidData = this.myxmldata;
      this.ministatement.dpId = this.fingerData.dpId;
      this.ministatement.rdsId = this.fingerData.rdsId;
      this.ministatement.rdsVer = this.fingerData.rdsVer;
      this.ministatement.dc = this.fingerData.dc;
      this.ministatement.mi = this.fingerData.mi;
      this.ministatement.mcData = this.fingerData.mcData;
      this.ministatement.sKey = this.fingerData.sKey;
      this.ministatement.hMac = this.fingerData.hMac;
      this.ministatement.encryptedPID = this.fingerData.encryptedPID;
      this.ministatement.ci = this.fingerData.ci;
      this.ministatement.iin = this.radioBankNameMS;
    }


    this.ministatement.bankName = this.radioextbankNameMS;
    this.ministatement.ipAddress = "106.222.173.232";
    this.ministatement.latLong = this.latlng;
    this.ministatement.apiUser = "WEBUSER";
    this.ministatement.freshnessFactor = "default";
    this.ministatement.operation = "WITHDRAW";
    this.ministatement.gatewayPriority = e;
    console.log(this.sha256(this.ministatement.aadharNo));
    this.ministatement.shakey = this.sha256(this.ministatement.aadharNo);
    //console.log(this.sha256(this.cashwithdraw.aadharNo));
    console.log(this.ministatement);
    const encodeUrlMS = await AuthConfig.config.encodeUrl(aepsAllApi.url.ministatement);

    if (parseInt(this.radioBankNameMS)) {
      this.aepsservice.ministatement(encodeUrlMS, this.ministatement).pipe(timeout(60 * 1000)).subscribe(
        (res: any) => {
          // this.connectSocketMS();
          console.log(res);
          this.ministatementresapi = res;
          this.ministatementresfetch = true;


         
            this.ministatementres = res;
            if (this.ministatementres.status === "SUCCESS") {
              this.aepsformMS.reset();
              this.ministatementresfetch1 = true;
              this.ministatementresfetch = false;

          


              this.mini_thValues = this.ministatementres.ministatement;
              this.mini_thValuesBalanceFetch = this.ministatementres.balance;
              // this.mini_thValues = this.mini_thValues.ministatement;
              this.confirmMessageMS_socket.show();
              this.ministatement.rdsId = "";
              this.ministatement.rdsVer = "";
              this.ministatement.dc = "";
              this.ministatement.mi = "";
              this.ministatement.mcData = "";
              this.ministatement.sKey = "";
              this.ministatement.hMac = "";
              this.ministatement.encryptedPID = "";
              this.ministatement.ci = "";
              this.QScore = 0;
            }
            else {
  
              /* let ares={"txId":"837234831757680640","apiTid":"111913033628","account_balance":"{\"balance\":\"1055.21\",\"ministatement\":[{\"Date\":\"27/04/2021\",\"Type\":\"NFI/CASH\",\"DebitCredit\":\"D\",\"Amount\":1.0},{\"Date\":\"27/04/2021\",\"Type\":\"NFI/CASH\",\"DebitCredit\":\"D\",\"Amount\":1.0},{\"Date\":\"26/04/2021\",\"Type\":\"NFS/6J49\",\"DebitCredit\":\"D\",\"Amount\":101.0},{\"Date\":\"26/04/2021\",\"Type\":\"UPI/1115\",\"DebitCredit\":\"D\",\"Amount\":599.0},{\"Date\":\"23/04/2021\",\"Type\":\"UPI/1113\",\"DebitCredit\":\"D\",\"Amount\":51.0},{\"Date\":\"20/04/2021\",\"Type\":\"UPI/1110\",\"DebitCredit\":\"D\",\"Amount\":300.0},{\"Date\":\"20/04/2021\",\"Type\":\"UPI/1110\",\"DebitCredit\":\"D\",\"Amount\":599.0},{\"Date\":\"19/04/2021\",\"Type\":\"UPI/1108\",\"DebitCredit\":\"D\",\"Amount\":538.0},{\"Date\":\"19/04/2021\",\"Type\":\"UPI/1108\",\"DebitCredit\":\"D\",\"Amount\":853.0}]}","transactionMode":"AEPS_MINI_STATEMENT","origin_identifier":"xxxx-xxxx-9680","status":"SUCCESS","statusDesc":"Mini statement has been generated successfully.","apiComment":"Mini statement has been generated successfully.","createdDate":"2021-04-29 13:22:18","updatedDate":"2021-04-29 13:22:24","balance":"1055.21","bankName":"ICICI Bank","message":"ministatement success ","bcId":488,"bc_location":"Bhubaneswar,OR","npci_tran_data":"00100207002003UID0050021000635027/04/2021 Dr 1.00 NFI/CASH27/04/2021 Dr 1.00 NFI/CASH26/04/2021 Dr 101.00 NFS/6J4926/04/2021 Dr 599.00 UPI/111523/04/2021 Dr 51.00 UPI/111320/04/2021 Dr 300.00 UPI/111020/04/2021 Dr 599.00 UPI/111019/04/2021 Dr 538.00 UPI/110819/04/2021 Dr 853.00 UPI/1108Balance 000000105521 "}
              this.mini_thValues=JSON.parse(ares.account_balance);
              this.mini_thValuesBalanceFetch=JSON.parse(ares.account_balance).balance;
              this.mini_thValues=this.mini_thValues.ministatement;*/
              this.confirmModalMS.show();
              this.ministatementresfetch = true;
              this.ministatement.dpId = "";
              this.ministatement.rdsId = "";
              this.ministatement.rdsVer = "";
              this.ministatement.dc = "";
              this.ministatement.mi = "";
              this.ministatement.mcData = "";
              this.ministatement.sKey = "";
              this.ministatement.hMac = "";
              this.ministatement.encryptedPID = "";
              this.ministatement.ci = "";
              this.QScore = 0;
            }
  
            this.ngxSpinner.hide('elasticSpinner');
            this.QScoreData = false;
            
          
          //console.log(this.ministatementres);
          //this.confirmModalMS.show();
          //this.ngxSpinner.hide('elasticSpinner');
        },
        (err: any) => {
          console.log(err);
          //this.confirmModalMS.show();
          //this.ministatementresapi=err.error.message;
          //this.ministatementresfetch=true;
          //console.log(this.balanceEnquiryres);
          vex.dialog.alert(err.error.transactionStatus);
          this.ngxSpinner.hide('elasticSpinner');
          this.QScore = 0;
          this.ministatement.dpId = "";
          this.ministatement.rdsId = "";
          this.ministatement.rdsVer = "";
          this.ministatement.dc = "";
          this.ministatement.mi = "";
          this.ministatement.mcData = "";
          this.ministatement.sKey = "";
          this.ministatement.hMac = "";
          this.ministatement.encryptedPID = "";
          this.ministatement.ci = "";
          if (err.name == 'TimeoutError') {
            this.connectSocketMS();
          } else {
            vex.dialog.alert(err);
            this.ministatementresapi = err.error;
            this.ngxSpinner.hide('elasticSpinner');
          }


        }
      );

    }
    else {
      vex.dialog.alert("Please Select Bank Name");
      this.ngxSpinner.hide('elasticSpinner');
    }
  }

  connectSocketAP() {
    this.socketService3.setupSocket();

    const socketSub = this.socketService3.socketData
      .pipe(takeUntil(this.unsub))
      .subscribe((data: any) => {
        if (data) {
          console.log('Socket Data In Aeps: ', data);
          setTimeout(() => {
            // this.appService.fetchWalletBalance();
          }, 2000);
          this.aadhaarpay_socketdis = data;
          if (this.aadhaarpay_socketdis.status === "SUCCESS") {
            this.aepsformAP.reset();
            this.Aadharpayfetch = true;
            this.confirmModalAP.show();
            this.aadharPay.dpId = "";
            this.aadharPay.rdsId = "";
            this.aadharPay.rdsVer = "";
            this.aadharPay.dc = "";
            this.aadharPay.mi = "";
            this.aadharPay.mcData = "";
            this.aadharPay.sKey = "";
            this.aadharPay.hMac = "";
            this.aadharPay.encryptedPID = "";
            this.aadharPay.ci = "";
            this.QScore = 0;
          }
          else {
            this.confirmModalAP.show();
            this.Aadharpayfetch = true;
            this.aadharPay.dpId = "";
            this.aadharPay.rdsId = "";
            this.aadharPay.rdsVer = "";
            this.aadharPay.dc = "";
            this.aadharPay.mi = "";
            this.aadharPay.mcData = "";
            this.aadharPay.sKey = "";
            this.aadharPay.hMac = "";
            this.aadharPay.encryptedPID = "";
            this.aadharPay.ci = "";
            this.QScore = 0;
          }

          this.ngxSpinner.hide('elasticSpinner');
          this.QScoreData = false;
          if (data.socket_timeout) {
            this.Aadharpayfetch = false;
            console.log("socket time out before");
            console.log(data);
            console.log(this.aadhaarpay_socketdis);
            console.log(this.aadharpayres.txId);
            this.confirmModalAP_socket.show();
          }
          socketSub.unsubscribe();
          this.socketService3.disconnectSocket();
        }
      });
  }


  async aadharpayaftersocket() {

    this.confirmModalAP_socket.hide();
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    const encodeUrl = await AuthConfig.config.encodeUrl(`https://aepscomposer.iserveu.tech/transactionEnquiry/${this.aadharpayres.txId}`);
    //this.aepsservice.aadharPay(encodeUrl,this.aadharPay).subscribe(
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      // observe: 'response' as 'body'
    };
    this.http.post(encodeUrl, httpOptions).subscribe(
      res => {
        this.ngxSpinner.hide('elasticSpinner');
        this.Aadharpayfetch = true;
        console.log(res);
        this.aadhaarpay_socketdis = res;
        this.confirmModalAP.show();
        this.aepsformAP.reset();
        this.QScore = 0;
        this.aadharPay.dpId = "";
        this.aadharPay.rdsId = "";
        this.aadharPay.rdsVer = "";
        this.aadharPay.dc = "";
        this.aadharPay.mi = "";
        this.aadharPay.mcData = "";
        this.aadharPay.sKey = "";
        this.aadharPay.hMac = "";
        this.aadharPay.encryptedPID = "";
        this.aadharPay.ci = "";
      },
      err => {
        this.ngxSpinner.hide('elasticSpinner');
        this.Aadharpayfetch = true;
        console.log(err);
        vex.dialog.alert(`Some problem occoured while fetching transcation status please check the report section for transaction id - ${this.aadharpayres.txId}}`)
        this.QScore = 0;
        this.aadharPay.dpId = "";
        this.aadharPay.rdsId = "";
        this.aadharPay.rdsVer = "";
        this.aadharPay.dc = "";
        this.aadharPay.mi = "";
        this.aadharPay.mcData = "";
        this.aadharPay.sKey = "";
        this.aadharPay.hMac = "";
        this.aadharPay.encryptedPID = "";
        this.aadharPay.ci = "";
      }
    )

  }



  onChangematSlide(e) {
    console.log(e.checked);
    this.matchecked = e.checked
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    console.log(event);
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  async SmsSendMobileCW() {
    const user: { sub: string } = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    const encodeUrl = await AuthConfig.config.encodeUrl(`https://wallet-deduct-sms-vn3k2k7q7q-uc.a.run.app/`);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),

    };
    let otherData = {
      "user_name": user.sub,
      "MobileNumber": this.smscashwithdrawMobile,
      "smsFor": "transaction",
      "message": "Your " + this.cashwithdrawres.bankName + " Acct seeded with Aadhaar No " + this.cashwithdrawres.origin_identifier + " is debited with Rs." + this.cashwithdraw.amount + ".00" + " Avl Bal " + "is Rs." + this.cashwithdrawres.balance + " as on " + this.cashwithdrawres.updatedDate + ". " + "Thanks "
    }
    this.http.post(encodeUrl, otherData).subscribe(
      (res: any) => {
        this.ngxSpinner.hide('elasticSpinner');
        console.log(res.results.message);
        vex.dialog.alert(res.results.message)
      },
      err => {
        this.ngxSpinner.hide('elasticSpinner');
        console.log(err);
        vex.dialog.alert(err.error.message)
      })

  }

  async SmsSendMobileBE() {
    const user: { sub: string } = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    const encodeUrl = await AuthConfig.config.encodeUrl(`https://wallet-deduct-sms-vn3k2k7q7q-uc.a.run.app/`);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),

    };
    let otherData = {
      "user_name": user.sub,
      "MobileNumber": this.smsbalanceEnquiryMobile,
      "smsFor": "transaction",
      "message": "Thanks for visiting " + ".\nCurrent balance for " + this.balanceEnquiryres.bankName + " account seeded with aadhaar " + this.balanceEnquiryres.origin_identifier + " is Rs " + this.balanceEnquiryres.balance + ". Dated " + this.balanceEnquiryres.updatedDate + "."
    }
    this.http.post(encodeUrl, otherData).subscribe(
      (res: any) => {
        this.ngxSpinner.hide('elasticSpinner');
        console.log(res.results.message);
        vex.dialog.alert(res.results.message)
      },
      err => {
        this.ngxSpinner.hide('elasticSpinner');
        console.log(err);
        vex.dialog.alert(err.error.message)
      })

  }


  async SmsSendMobileAP() {
    const user: { sub: string } = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    const encodeUrl = await AuthConfig.config.encodeUrl(`https://wallet-deduct-sms-vn3k2k7q7q-uc.a.run.app/`);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),

    };
    let otherData = {
      "user_name": user.sub,
      "MobileNumber": this.smsaadharpayMobile,
      "smsFor": "transaction",
      "message": "Your " + this.aadhaarpay_socketdis.bankName + " Acct seeded with Aadhaar No " + this.aadhaarpay_socketdis.origin_identifier + " is debited with Rs." + this.aadharPay.amount + ".00" + " Avl Bal " + "is Rs." + this.aadhaarpay_socketdis.balance + " as on " + this.aadhaarpay_socketdis.updatedDate + ". " + "Thanks "
    }
    this.http.post(encodeUrl, otherData).subscribe(
      (res: any) => {
        this.ngxSpinner.hide('elasticSpinner');
        console.log(res.results.message);
        vex.dialog.alert(res.results.message)
      },
      err => {
        this.ngxSpinner.hide('elasticSpinner');
        console.log(err);
        vex.dialog.alert(err.error.message)
      })

  }


  public captureScreen() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('Ministatement.pdf'); // Generated PDF
    });
  }


  async submit_aadharpay(e) {

    // this.amount_ap = this.aepsformAP.get('amountdetails').value
    // if (((this.amount_ap)%100 == 0)) {
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    if (this.radioBankNameAP1 === 'other5') {
      this.radioBankNameAP = this.aepsformAP.get('bankname').value.IIN;
      this.radioextbankNameAP = this.aepsformAP.get('bankname').value.BANKNAME;
    }
    else {
      this.radioBankNameAP = this.radioBankNameAP1;
    }
    if (this.radiovalueAmountAP1 === 'other6') {
      this.radiovalueAmountAP = this.aepsformAP.get('amountdetails').value;
    }
    else {
      this.radiovalueAmountAP = this.radiovalueAmountAP1;
      //this.radioextbankNameAP=this.aepsformAP.get('bankname').value.BANKNAME;
      if (this.radioBankNameAP1 == 607094) {
        this.radioextbankNameAP = "State Bank of India";
      }
      else if (this.radioBankNameAP1 == 606985) {
        this.radioextbankNameAP = "Bank of Baroda";
      }
      else if (this.radioBankNameAP1 == 607396) {
        this.radioextbankNameAP = "Canara Bank";
      }

    }
    this.aadharPay.mobileNumber = this.aepsformAP.get('mobileNumber').value;
    this.smsaadharpayMobile = this.aadharPay.mobileNumber;
    let cwadhap1 = this.aepsformAP.get('cwadh1').value;
    let cwadhap2 = this.aepsformAP.get('cwadh2').value;
    let cwadhap3 = this.aepsformAP.get('cwadh3').value;
    cwadhap3 = cwadhap3.length > 4 ? cwadhap3.slice(0, -1) : cwadhap3;
    this.aadharPay.aadharNo = `${cwadhap1}${cwadhap2}${cwadhap3}`;
    console.log(this.aadharPay.aadharNo);

    this.aadharPay.iin = this.radioBankNameAP;
    this.aadharPay.amount = this.radiovalueAmountAP;
    this.aadharPay.latLong = this.latlng;

    if (e == 0) {
      this.aadharPay.pidData = this.myxmlfetchdata;
    } else {
      this.aadharPay.pidData = this.myxmldata;
      this.aadharPay.dpId = this.fingerData.dpId;
      this.aadharPay.rdsId = this.fingerData.rdsId;
      this.aadharPay.rdsVer = this.fingerData.rdsVer;
      this.aadharPay.dc = this.fingerData.dc;
      this.aadharPay.mi = this.fingerData.mi;
      this.aadharPay.mcData = this.fingerData.mcData;
      this.aadharPay.sKey = this.fingerData.sKey;
      this.aadharPay.hMac = this.fingerData.hMac;
      this.aadharPay.encryptedPID = this.fingerData.encryptedPID;
      this.aadharPay.ci = this.fingerData.ci;
      this.aadharPay.iin = this.radioBankNameAP;
    }


    this.aadharPay.bankName = this.radioextbankNameAP;
    this.aadharPay.ipAddress = "106.222.173.232";
    this.aadharPay.apiUser = "WEBUSER";
    this.aadharPay.freshnessFactor = "default";
    this.aadharPay.operation = "WITHDRAW";
    console.log(this.sha256(this.aadharPay.aadharNo));
    this.aadharPay.shakey = this.sha256(this.aadharPay.aadharNo);
    //console.log(this.sha256(this.cashwithdraw.aadharNo));
    console.log(this.aadharPay);
    const encodeUrl = await AuthConfig.config.encodeUrl(aepsAllApi.url.aadharPay);

    if (parseInt(this.radioBankNameAP)) {
      this.aepsservice.aadharPay(encodeUrl, this.aadharPay).subscribe(
        (res: any) => {
          console.log(res);
          this.connectSocketAP();
          this.aadharpayres = res;
          //this.confirmModalAP.show();
          //this.ngxSpinner.hide('elasticSpinner');
        },
        (err: any) => {
          vex.dialog.alert(err.error.transactionStatus)
          console.log(err.error.transactionStatus);
          this.Aadharpayfetch = false;
          //this.confirmModalAP.show();
          //this.aadharpayres=err.error;
          this.ngxSpinner.hide('elasticSpinner');
          this.QScore = 0;
          this.aadharPay.dpId = "";
          this.aadharPay.rdsId = "";
          this.aadharPay.rdsVer = "";
          this.aadharPay.dc = "";
          this.aadharPay.mi = "";
          this.aadharPay.mcData = "";
          this.aadharPay.sKey = "";
          this.aadharPay.hMac = "";
          this.aadharPay.encryptedPID = "";
          this.aadharPay.ci = "";
        }
      );
    }
    else {
      vex.dialog.alert("Please Select Bank Name");
      this.ngxSpinner.hide('elasticSpinner');
    }
    // } else {
    //   vex.dialog.alert("Please enter value in multiples of Rs 100");
    //       this.Aadharpayfetch = false;
    //       this.ngxSpinner.hide('elasticSpinner');
    //       this.QScore = 0;
    //       this.aadharPay.dpId = "";
    //       this.aadharPay.rdsId = "";
    //       this.aadharPay.rdsVer = "";
    //       this.aadharPay.dc = "";
    //       this.aadharPay.mi = "";
    //       this.aadharPay.mcData = "";
    //       this.aadharPay.sKey = "";
    //       this.aadharPay.hMac = "";
    //       this.aadharPay.encryptedPID = "";
    //       this.aadharPay.ci = "";
    // }
  }


  generatePDFCW() {

    var rblLogoUrl1
    var iserveuLogoUrl;
    if (this.cashwithdrawres.gateway == 1) {
      var rblLogoPath = '../../../../assets/images/finologo.png';
    }
    else if (this.cashwithdrawres.gateway == 3) {
      var rblLogoPath = '../../../../assets/images/indusind.png';
    }
    else {
      var rblLogoPath = '../../../../assets/images/rbl-bank.png';
    }
    var iserveuLogoPath = '../../../../assets/images/image005.png';
    var mypromise = new Promise((resolve, reject) => {

      function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
            callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      };

      // Convert image
      toDataURL(rblLogoPath, function (base64Image) {
        rblLogoUrl1 = base64Image;
        //console.log(rblLogoUrl1);
        resolve('ok');
        //this.rblLogoUrl=rblLogoUrl1;
        //console.log(this.rblLogoUrl)
      });
      toDataURL(iserveuLogoPath, function (base64Image) {
        iserveuLogoUrl = base64Image;
      });



    })

    mypromise.then(res => {
      if (res) {
        console.log(rblLogoUrl1);
        this.rblLogoUrl = rblLogoUrl1



        const user: { sub: string } = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
        console.log(user.sub);
        //var TerminalId = print_data.terminalId;
        //var AgentLocation = print_data.agentLocation;
        var userName = user.sub;

        let docDefinition = {
          pageSize: 'A4',
          pageMargins: [40, 40, 40, 40],
          content: [{//start
            pageSize: 'A4',
            columns: [
              //{
              //image: rblLogoUrl,
              //width: 500,
              //height: 60,
              //margin: [100, 0, 0, 0],
              //alignment: 'center'
              //}

            ],
            styles: {
              floatRight: {
                alignment: 'right'
              },
              floatLeft: {
                alignment: 'left'
              },
              logoHeight: {
                width: 100,
                height: 50
              }
            }//end

          },

          {
            columns: [{
              image: this.rblLogoUrl
            }]
          },

          {//start
            columns: [{
              canvas: [{
                type: 'polyline',
                lineWidth: 2,
                color: 'blue',
                lineColor: 'red',
                points: [{
                  x: 0,
                  y: 30
                }, {
                  x: 500,
                  y: 30
                }]
              }]
            }]//end
          }, {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [30],
                color: '#ddd',
                body: [
                  [{
                    text: this.cashwithdrawres.transactionMode,
                    bold: true,
                    fontSize: 14,
                    alignment: 'center',
                    margin: [0, 8, 0, 0]
                  }],
                ]
              }
            }]
          }, {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [10, 10],
                border: [false, false, false, false],
                // color: '#ddd',
                body: [
                  [{
                    text: 'Date : ' + this.cashwithdrawres.updatedDate,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'User Name : ' + userName,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }],
                  // [{
                  //   text: `BC Agent Id: ${this.cashwithdrawres.bcId}`,
                  //   fontSize: 10,
                  //   // alignment: 'center',
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Contact: ' + this.cashwithdraw.mobileNumber,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }]
                ]
              }
            }]
          },
          {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10],
                border: [false, false, false, false],
                body: [

                  // [{
                  //   text: 'Customer Name : ' + "Not Available",
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  // [{
                  //     text: 'Customer A/c No. : ',
                  //     fontSize: 10,
                  //     border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Customer Aadhaar No. : ' + this.cashwithdrawres.origin_identifier,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  // [{
                  //     text: 'Beneficiary Aadhaar No. : ' + beneAadharNo,
                  //     fontSize: 10,
                  //     border: [false, false, false, false]
                  // }],
                  [{
                    text: 'RRN : ' + this.cashwithdrawres.apiTid,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  // [{
                  //   text: 'STAN : ' + 'Not Available',
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  // [{
                  //   text: 'UID Auth Code : ' + 'Not Available',
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Transaction Status : ' + this.cashwithdrawres.status,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'Transaction Amount : Rs. ' + this.cashwithdraw.amount,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  // [{
                  //   text: 'A/C Balance : Rs. ' + this.cashwithdrawres.balance,
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Bank Name : ' + this.cashwithdrawres.bankName,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }]
                ]
              }
            }]
          }, {
            columns: [{
              text: "Note : Please do not pay any charge/fee for this txn",
              bold: true,
              fontSize: 18,
              italics: true
            }]
          },
          {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [30],
                color: '#ddd',
                body: [
                  [{
                    text: 'Customer Copy',
                    fontSize: 12,
                    alignment: 'center',
                    margin: [0, 8, 0, 0]
                  }],
                ]
              }
            }]
          }
          ],

          styles: {
            status: {
              margin: [0, 30, 0, 0]
            },
            tableExample: {
              margin: [0, 30, 0, 0]
            },
            header: {
              margin: [0, 5, 0, 0],
              fontSize: 15,
              bold: true
            },
            bigger: {
              fontSize: 10,
              italics: true,
            },
            footer: {
              margin: [420, 0, 0, 4],
              fontSize: 13,
              bold: true
            }

          }
        }
        pdfMake.createPdf(docDefinition).download(`cashwithdraw_${this.cashwithdrawres.updatedDate}.pdf`);
      }
    })
  }

  generatePDFMS(action = 'open') {

    var rblLogoUrl2
    //var iserveuLogoUrl;
    if (this.ministatementres.gateway == 1) {
      var rblLogoPath = '../../../../assets/images/finologo.png';
    }
    else if (this.ministatementres.gateway == 3) {
      var rblLogoPath = '../../../../assets/images/indusind.png';
    }
    else {
      var rblLogoPath = '../../../../assets/images/rbl-bank.png';
    }
    var iserveuLogoPath = '../../../../assets/images/image005.png';
    var mypromise = new Promise((resolve, reject) => {

      function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
            callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      };

      // Convert image
      toDataURL(rblLogoPath, function (base64Image) {
        rblLogoUrl2 = base64Image;
        //console.log(rblLogoUrl1);
        resolve('ok');
        //this.rblLogoUrl=rblLogoUrl1;
        //console.log(this.rblLogoUrl)
      });
      /*   toDataURL(iserveuLogoPath, function(base64Image) {
            iserveuLogoUrl = base64Image;
        }); */



    })



    mypromise.then(res => {
      if (res) {
        console.log(rblLogoUrl2);
        this.rblLogoUrl = rblLogoUrl2

        const user: { sub: string } = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
        console.log(user.sub);
        //var TerminalId = print_data.terminalId;
        //var AgentLocation = print_data.agentLocation;
        var userName = user.sub;

        let docDefinition = {
          pageSize: 'A4',
          pageMargins: [40, 40, 40, 40],
          content: [{//start
            pageSize: 'A4',
            columns: [
              //{
              //image: rblLogoUrl,
              //width: 500,
              //height: 60,
              //margin: [100, 0, 0, 0],
              //alignment: 'center'
              //}

            ],
            styles: {
              floatRight: {
                alignment: 'right'
              },
              floatLeft: {
                alignment: 'left'
              },
              logoHeight: {
                width: 100,
                height: 50
              }
            }//end

          },

          {
            columns: [{
              image: this.rblLogoUrl
            }]
          },

          {//start
            columns: [{
              canvas: [{
                type: 'polyline',
                lineWidth: 2,
                color: 'blue',
                lineColor: 'red',
                points: [{
                  x: 0,
                  y: 30
                }, {
                  x: 500,
                  y: 30
                }]
              }]
            }]//end
          }, {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [30],
                color: '#ddd',
                body: [
                  [{
                    text: `Ministatement`,
                    bold: true,
                    fontSize: 14,
                    alignment: 'center',
                    margin: [0, 8, 0, 0]
                  }],
                ]
              }
            }]
          }, {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [10, 10],
                border: [false, false, false, false],
                // color: '#ddd',
                body: [
                  [{
                    text: 'Date : ' + this.ministatementres.updatedDate,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'User Name : ' + userName,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }],
                  // [{
                  //   text: `BC Agent Id: ${this.ministatementres.bcId}`,
                  //   fontSize: 10,
                  //   // alignment: 'center',
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Contact: ' + this.ministatement.mobileNumber,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }]
                ]
              }
            }]
          },
          {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10],
                border: [false, false, false, false],
                body: [

                  // [{
                  //   text: 'Customer Name : ' + "Not Available",
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  // [{
                  //     text: 'Customer A/c No. : ',
                  //     fontSize: 10,
                  //     border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Customer Aadhaar No. : ' + this.ministatementres.origin_identifier,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  // [{
                  //     text: 'Beneficiary Aadhaar No. : ' + beneAadharNo,
                  //     fontSize: 10,
                  //     border: [false, false, false, false]
                  // }],
                  [{
                    text: 'RRN : ' + this.ministatementres.apiTid,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  // [{
                  //   text: 'STAN : ' + 'Not Available',
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  // [{
                  //   text: 'UID Auth Code : ' + 'Not Available',
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Transaction Status : ' + this.ministatementres.status,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],

                  // [{
                  //   text: 'A/C Balance : Rs. ' + this.ministatementres.balance,
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Bank Name : ' + this.ministatementres.bankName,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }]
                ]
              }
            }]
          }, {
            columns: [{
              text: "Note : Please do not pay any charge/fee for this txn",
              bold: true,
              fontSize: 18,
              italics: true
            }]
          },
          {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [30],
                color: '#ddd',
                body: [
                  [{
                    text: 'Customer Copy',
                    fontSize: 12,
                    alignment: 'center',
                    margin: [0, 8, 0, 0]
                  }],
                ]
              }
            }]
          }
          ],

          styles: {
            status: {
              margin: [0, 30, 0, 0]
            },
            tableExample: {
              margin: [0, 30, 0, 0]
            },
            header: {
              margin: [0, 5, 0, 0],
              fontSize: 15,
              bold: true
            },
            bigger: {
              fontSize: 10,
              italics: true,
            },
            footer: {
              margin: [420, 0, 0, 4],
              fontSize: 13,
              bold: true
            }

          }


        }
        pdfMake.createPdf(docDefinition).download(`ministatement${this.ministatementres.updatedDate}.pdf`);
      }
    })
  }

  generatePDFBE(action = 'open') {

    var rblLogoUrl2
    //var iserveuLogoUrl;
    if (this.balanceEnquiryres.gateway == 1) {
      var rblLogoPath = '../../../../assets/images/finologo.png';
    }
    else if (this.balanceEnquiryres.gateway == 3) {
      var rblLogoPath = '../../../../assets/images/indusind.png';
    }
    else {
      var rblLogoPath = '../../../../assets/images/rbl-bank.png';
    }
    var iserveuLogoPath = '../../../../assets/images/image005.png';
    var mypromise = new Promise((resolve, reject) => {

      function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
            callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      };

      // Convert image
      toDataURL(rblLogoPath, function (base64Image) {
        rblLogoUrl2 = base64Image;
        //console.log(rblLogoUrl1);
        resolve('ok');
        //this.rblLogoUrl=rblLogoUrl1;
        //console.log(this.rblLogoUrl)
      });
      /*   toDataURL(iserveuLogoPath, function(base64Image) {
            iserveuLogoUrl = base64Image;
        }); */



    })



    mypromise.then(res => {
      if (res) {
        console.log(rblLogoUrl2);
        this.rblLogoUrl = rblLogoUrl2

        const user: { sub: string } = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
        console.log(user.sub);
        //var TerminalId = print_data.terminalId;
        //var AgentLocation = print_data.agentLocation;
        var userName = user.sub;

        let docDefinition = {
          pageSize: 'A4',
          pageMargins: [40, 40, 40, 40],
          content: [{//start
            pageSize: 'A4',
            columns: [
              //{
              //image: rblLogoUrl,
              //width: 500,
              //height: 60,
              //margin: [100, 0, 0, 0],
              //alignment: 'center'
              //}

            ],
            styles: {
              floatRight: {
                alignment: 'right'
              },
              floatLeft: {
                alignment: 'left'
              },
              logoHeight: {
                width: 100,
                height: 50
              }
            }//end

          },

          {
            columns: [{
              image: this.rblLogoUrl
            }]
          },

          {//start
            columns: [{
              canvas: [{
                type: 'polyline',
                lineWidth: 2,
                color: 'blue',
                lineColor: 'red',
                points: [{
                  x: 0,
                  y: 30
                }, {
                  x: 500,
                  y: 30
                }]
              }]
            }]//end
          }, {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [30],
                color: '#ddd',
                body: [
                  [{
                    text: 'AEPS BALANCE ENQUIRY.',
                    bold: true,
                    fontSize: 14,
                    alignment: 'center',
                    margin: [0, 8, 0, 0]
                  }],
                ]
              }
            }]
          }, {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [10, 10],
                border: [false, false, false, false],
                // color: '#ddd',
                body: [
                  [{
                    text: 'Date : ' + this.balanceEnquiryres.updatedDate,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'User Name : ' + userName,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }],
                  // [{
                  //   text: `BC Agent Id: ${this.balanceEnquiryres.bcId}`,
                  //   fontSize: 10,
                  //   // alignment: 'center',
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Contact: ' + this.balanceEnquiry.mobileNumber,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }]
                ]
              }
            }]
          },
          {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10],
                border: [false, false, false, false],
                body: [

                  // [{
                  //   text: 'Customer Name : ' + "Not Available",
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  // [{
                  //     text: 'Customer A/c No. : ',
                  //     fontSize: 10,
                  //     border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Customer Aadhaar No. : ' + this.balanceEnquiryres.origin_identifier,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  // [{
                  //     text: 'Beneficiary Aadhaar No. : ' + beneAadharNo,
                  //     fontSize: 10,
                  //     border: [false, false, false, false]
                  // }],
                  [{
                    text: 'RRN : ' + this.balanceEnquiryres.apiTid,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  // [{
                  //   text: 'STAN : ' + 'Not Available',
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  // [{
                  //   text: 'UID Auth Code : ' + 'Not Available',
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Transaction Status : ' + this.balanceEnquiryres.status,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],

                  [{
                    text: 'A/C Balance : Rs. ' + this.balanceEnquiryres.balance,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'Bank Name : ' + this.balanceEnquiryres.bankName,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }]
                ]
              }
            }]
          }, {
            columns: [{
              text: "Note : Please do not pay any charge/fee for this txn",
              bold: true,
              fontSize: 18,
              italics: true
            }]
          },
          {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [30],
                color: '#ddd',
                body: [
                  [{
                    text: 'Customer Copy',
                    fontSize: 12,
                    alignment: 'center',
                    margin: [0, 8, 0, 0]
                  }],
                ]
              }
            }]
          }
          ],

          styles: {
            status: {
              margin: [0, 30, 0, 0]
            },
            tableExample: {
              margin: [0, 30, 0, 0]
            },
            header: {
              margin: [0, 5, 0, 0],
              fontSize: 15,
              bold: true
            },
            bigger: {
              fontSize: 10,
              italics: true,
            },
            footer: {
              margin: [420, 0, 0, 4],
              fontSize: 13,
              bold: true
            }

          }


        }
        pdfMake.createPdf(docDefinition).download(`balanceEnquiry_${this.balanceEnquiryres.updatedDate}.pdf`);
      }
    })
  }

  generatePDFAP(action = 'open') {

    var rblLogoUrl3
    //var iserveuLogoUrl;

    var rblLogoPath = '../../../../assets/images/finologo.png';

    var iserveuLogoPath = '../../../../assets/images/image005.png';
    var mypromise = new Promise((resolve, reject) => {

      function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          var reader = new FileReader();
          reader.onloadend = function () {
            callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      };

      // Convert image
      toDataURL(rblLogoPath, function (base64Image) {
        rblLogoUrl3 = base64Image;
        //console.log(rblLogoUrl1);
        resolve('ok');
        //this.rblLogoUrl=rblLogoUrl1;
        //console.log(this.rblLogoUrl)
      });
      /*   toDataURL(iserveuLogoPath, function(base64Image) {
            iserveuLogoUrl = base64Image;
        }); */



    })


    mypromise.then(res => {
      if (res) {
        console.log(rblLogoUrl3);
        this.rblLogoUrl = rblLogoUrl3

        const user: { sub: string } = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
        console.log(user.sub);
        //var TerminalId = print_data.terminalId;
        //var AgentLocation = print_data.agentLocation;
        var userName = user.sub;

        let docDefinition = {
          pageSize: 'A4',
          pageMargins: [40, 40, 40, 40],
          content: [{//start
            pageSize: 'A4',
            columns: [
              //{
              //image: rblLogoUrl,
              //width: 500,
              //height: 60,
              //margin: [100, 0, 0, 0],
              //alignment: 'center'
              //}

            ],
            styles: {
              floatRight: {
                alignment: 'right'
              },
              floatLeft: {
                alignment: 'left'
              },
              logoHeight: {
                width: 100,
                height: 50
              }
            }//end

          },

          {
            columns: [{
              image: this.rblLogoUrl
            }]
          },

          {//start
            columns: [{
              canvas: [{
                type: 'polyline',
                lineWidth: 2,
                color: 'blue',
                lineColor: 'red',
                points: [{
                  x: 0,
                  y: 30
                }, {
                  x: 500,
                  y: 30
                }]
              }]
            }]//end
          }, {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [30],
                color: '#ddd',
                body: [
                  [{
                    text: `AADHAAR PAY`,
                    bold: true,
                    fontSize: 14,
                    alignment: 'center',
                    margin: [0, 8, 0, 0]
                  }],
                ]
              }
            }]
          }, {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [10, 10],
                border: [false, false, false, false],
                // color: '#ddd',
                body: [
                  [{
                    text: 'Date : ' + this.aadhaarpay_socketdis.updatedDate,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'User Name : ' + userName,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }],
                  // [{
                  //   text: `BC Agent Id: ${this.aadhaarpay_socketdis.bcId}`,
                  //   fontSize: 10,
                  //   // alignment: 'center',
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Amount: ' + this.aadharPay.amount,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'Contact: ' + this.aadharPay.mobileNumber,
                    fontSize: 10,
                    // alignment: 'center',
                    border: [false, false, false, false]
                  }]
                ]
              }
            }]
          },
          {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10],
                border: [false, false, false, false],
                body: [

                  // [{
                  //   text: 'Customer Name : ' + "Not Available",
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  // [{
                  //     text: 'Customer A/c No. : ',
                  //     fontSize: 10,
                  //     border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Customer Aadhaar No. : ' + this.aadhaarpay_socketdis.origin_identifier,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  // [{
                  //     text: 'Beneficiary Aadhaar No. : ' + beneAadharNo,
                  //     fontSize: 10,
                  //     border: [false, false, false, false]
                  // }],
                  [{
                    text: 'RRN : ' + this.aadhaarpay_socketdis.apiTid,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  // [{
                  //   text: 'STAN : ' + 'Not Available',
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  // [{
                  //   text: 'UID Auth Code : ' + 'Not Available',
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Transaction Status : ' + this.aadhaarpay_socketdis.status,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],

                  // [{
                  //   text: 'A/C Balance : Rs. ' + this.aadhaarpay_socketdis.balance,
                  //   fontSize: 10,
                  //   border: [false, false, false, false]
                  // }],
                  [{
                    text: 'Bank Name : ' + this.aadhaarpay_socketdis.bankName,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }]
                ]
              }
            }]
          }, {
            columns: [{
              text: "Note : Please do not pay any charge/fee for this txn",
              bold: true,
              fontSize: 18,
              italics: true
            }]
          },
          {
            columns: [{
              margin: [0, 20, 0, 0],
              table: {
                widths: [490],
                heights: [30],
                color: '#ddd',
                body: [
                  [{
                    text: 'Customer Copy',
                    fontSize: 12,
                    alignment: 'center',
                    margin: [0, 8, 0, 0]
                  }],
                ]
              }
            }]
          }
          ],

          styles: {
            status: {
              margin: [0, 30, 0, 0]
            },
            tableExample: {
              margin: [0, 30, 0, 0]
            },
            header: {
              margin: [0, 5, 0, 0],
              fontSize: 15,
              bold: true
            },
            bigger: {
              fontSize: 10,
              italics: true,
            },
            footer: {
              margin: [420, 0, 0, 4],
              fontSize: 13,
              bold: true
            }

          }
        }
        pdfMake.createPdf(docDefinition).download(`aadharpay_${this.aadhaarpay_socketdis.updatedDate}.pdf`)();
      }
    })
  }

  mychange(val) {
    if (val) {
      this.QScore = 0;
    }
  }

  regCustomer4() {
    console.log(this.datameget);
    var res;
    var httpStaus = false;
    if (this.modeselect === "option5") {
      $.ajax({
        type: "CAPTURE",
        async: false,
        crossDomain: true,
        url: 'http://127.0.0.1:11101/rd/capture',
        data: "<PidOptions ver='1.0'><Opts env='S' fCount='1' fType='0' format='0' pType='0' pCount='0' pgCount='0' pTimeout='20000' pidVer='2.0'></Opts><Demo></Demo><CustOpts></CustOpts><Bios></Bios></PidOptions>",
        contentType: "text/xml; charset=utf-8",
        processData: false,
        success: function (data) {
          console.log(data);
          let qscore = data;
          //this.myvalue=true;
          console.log(this.QScore);
          //alert(data);
          //i = 11120;
          httpStaus = true;
          res = {
            data: data,
            httpStaus: httpStaus,
          };
          // $scope.txtPidData = data;
          // $scope.txtPidOptions = XML;
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          console.log(thrownError);
          console.log(jqXHR);
          vex.dialog.alert(thrownError)
          res = {
            httpStaus: httpStaus,
            //     err: getHttpError(jqXHR)
          };
        },
      });
      return res
    }

    else {
      $.ajax({
        type: "CAPTURE",
        async: false,
        crossDomain: true,
        url: 'http://127.0.0.1:11100/rd/capture',
        data: '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="0" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" posh="" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>',
        contentType: "text/xml; charset=utf-8",
        processData: false,
        success: function (data) {
          console.log(data);
          let qscore = data;
          //this.myvalue=true;
          console.log(this.QScore);
          //alert(data);
          //i = 11120;
          httpStaus = true;
          res = {
            data: data,
            httpStaus: httpStaus,
          };
          // $scope.txtPidData = data;
          // $scope.txtPidOptions = XML;
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          console.log(thrownError);
          console.log(jqXHR);
          vex.dialog.alert(`${thrownError} If you are using tatvik device then select the Device from Drop down`)
          res = {
            httpStaus: httpStaus,
            //     err: getHttpError(jqXHR)
          };
        },
      });
      return res
    }

  }
  captureFingerPrint() {
    let myres = this.regCustomer4();
    if (myres.httpStaus) {


      let dataXML = myres.data;

      if (typeof dataXML === 'string') {
        this.myxmldata = btoa(dataXML);
      }
      else if (typeof dataXML === 'object') {
        this.myxmldata = dataXML;
        let mydata2 = new XMLSerializer().serializeToString(this.myxmldata);
        this.myxmldata = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?> ${mydata2}`;
        this.myxmldata = btoa(this.myxmldata);
      }



      this.QScore = $(dataXML).find('Resp').attr('qScore');
      this.errorData = $(dataXML).find('Resp').attr('errCode');

      if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'Morpho.SmartChip') {
        vex.dialog.alert("Scan Successful");
        this.fingerData.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.fingerData.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.fingerData.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.fingerData.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.fingerData.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.fingerData.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.fingerData.sKey = $(dataXML).find('Skey').text();
        this.fingerData.hMac = $(dataXML).find('Hmac').text();
        this.fingerData.encryptedPID = $(dataXML).find('Data').text();
        this.fingerData.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.fingerData.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.fingerData);
      }

      else if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'TATVIK.TATVIK') {
        vex.dialog.alert("Scan Successful");
        this.QScore = parseInt(this.QScore) + 50;
        this.fingerData.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.fingerData.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.fingerData.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.fingerData.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.fingerData.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.fingerData.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.fingerData.sKey = $(dataXML).find('Skey').text();
        this.fingerData.hMac = $(dataXML).find('Hmac').text();
        this.fingerData.encryptedPID = $(dataXML).find('Data').text();
        this.fingerData.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.fingerData.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.fingerData);
      }

      else if (this.errorData != 0) {
        vex.dialog.alert($(dataXML).find('Resp').attr('errInfo'));
        this.QScore = 0;
      } else {
        vex.dialog.alert("Bad Quality, Please Try Again");
        this.QScoreData = false;
        this.QScore = 0;
      }

    }
  }

  capturecashwithdraw() {
    let myres = this.regCustomer4();
    if (myres.httpStaus) {


      let dataXML = myres.data;

      if (typeof dataXML === 'string') {
        this.myxmlfetchdataCW = btoa(dataXML);
      }
      else if (typeof dataXML === 'object') {
        this.myxmlfetchdataCW = dataXML;
        let mydata2 = new XMLSerializer().serializeToString(this.myxmlfetchdataCW);
        this.myxmlfetchdataCW = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?> ${mydata2}`;
        this.myxmlfetchdataCW = btoa(this.myxmlfetchdataCW);
      }



      this.QScore = $(dataXML).find('Resp').attr('qScore');
      this.errorData = $(dataXML).find('Resp').attr('errCode');

      if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'Morpho.SmartChip') {
        vex.dialog.alert("Scan Successful");
        this.cashwithdraw.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.cashwithdraw.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.cashwithdraw.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.cashwithdraw.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.cashwithdraw.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.cashwithdraw.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.cashwithdraw.sKey = $(dataXML).find('Skey').text();
        this.cashwithdraw.hMac = $(dataXML).find('Hmac').text();
        this.cashwithdraw.encryptedPID = $(dataXML).find('Data').text();
        this.cashwithdraw.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.cashwithdraw.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.cashwithdraw);
      }

      else if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'TATVIK.TATVIK') {
        vex.dialog.alert("Scan Successful");
        this.QScore = parseInt(this.QScore) + 50;
        this.cashwithdraw.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.cashwithdraw.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.cashwithdraw.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.cashwithdraw.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.cashwithdraw.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.cashwithdraw.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.cashwithdraw.sKey = $(dataXML).find('Skey').text();
        this.cashwithdraw.hMac = $(dataXML).find('Hmac').text();
        this.cashwithdraw.encryptedPID = $(dataXML).find('Data').text();
        this.cashwithdraw.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.cashwithdraw.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.cashwithdraw);
      }

      else if (this.errorData != 0) {
        vex.dialog.alert($(dataXML).find('Resp').attr('errInfo'));
        this.QScore = 0;
      } else {
        vex.dialog.alert("Bad Quality, Please Try Again");
        this.QScoreData = false;
        this.QScore = 0;
      }

    }
  }

  captureBalanceEnquiry() {
    console.log("form data", this.aepsformBE);
    console.log("form data", this.aepsformBE.get('cwadh1').value);

    let myres = this.regCustomer4();
    if (myres.httpStaus) {
      let dataXML = myres.data;


      if (typeof dataXML === 'string') {
        this.myxmlfetchdataBE = btoa(dataXML);
      }
      else if (typeof dataXML === 'object') {
        this.myxmlfetchdataBE = dataXML;
        let mydata2 = new XMLSerializer().serializeToString(this.myxmlfetchdataBE);
        this.myxmlfetchdataBE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?> ${mydata2}`;
        this.myxmlfetchdataBE = btoa(this.myxmlfetchdataBE);
      }

      this.QScore = $(dataXML).find('Resp').attr('qScore');
      this.errorData = $(dataXML).find('Resp').attr('errCode');

      if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'Morpho.SmartChip') {
        vex.dialog.alert("Scan Successful");
        this.balanceEnquiry.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.balanceEnquiry.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.balanceEnquiry.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.balanceEnquiry.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.balanceEnquiry.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.balanceEnquiry.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.balanceEnquiry.sKey = $(dataXML).find('Skey').text();
        this.balanceEnquiry.hMac = $(dataXML).find('Hmac').text();
        this.balanceEnquiry.encryptedPID = $(dataXML).find('Data').text();
        this.balanceEnquiry.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.cashwithdraw.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.cashwithdraw);
      }

      else if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'TATVIK.TATVIK') {
        vex.dialog.alert("Scan Successful");
        this.QScore = parseInt(this.QScore) + 50;
        this.balanceEnquiry.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.balanceEnquiry.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.balanceEnquiry.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.balanceEnquiry.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.balanceEnquiry.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.balanceEnquiry.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.balanceEnquiry.sKey = $(dataXML).find('Skey').text();
        this.balanceEnquiry.hMac = $(dataXML).find('Hmac').text();
        this.balanceEnquiry.encryptedPID = $(dataXML).find('Data').text();
        this.balanceEnquiry.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.cashwithdraw.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.cashwithdraw);
      }


      else if (this.errorData != 0) {
        vex.dialog.alert($(dataXML).find('Resp').attr('errInfo'));
        this.QScore = 0;
      } else {
        vex.dialog.alert("Bad Quality, Please Try Again");
        this.QScoreData = false;
        this.QScore = 0;
      }

    }
  }

  captureMinistatement() {
    let myres = this.regCustomer4();
    if (myres.httpStaus) {
      let dataXML = myres.data;
      if (typeof dataXML === 'string') {
        this.myxmlfetchdataMS = btoa(dataXML);
      }
      else if (typeof dataXML === 'object') {
        this.myxmlfetchdataMS = dataXML;
        let mydata2 = new XMLSerializer().serializeToString(this.myxmlfetchdataMS);
        this.myxmlfetchdataMS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?> ${mydata2}`;
        this.myxmlfetchdataMS = btoa(this.myxmlfetchdataMS);
      }
      this.QScore = $(dataXML).find('Resp').attr('qScore');
      this.errorData = $(dataXML).find('Resp').attr('errCode');

      if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'Morpho.SmartChip') {
        vex.dialog.alert("Scan Successful");
        this.ministatement.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.ministatement.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.ministatement.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.ministatement.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.ministatement.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.ministatement.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.ministatement.sKey = $(dataXML).find('Skey').text();
        this.ministatement.hMac = $(dataXML).find('Hmac').text();
        this.ministatement.encryptedPID = $(dataXML).find('Data').text();
        this.ministatement.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.cashwithdraw.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.cashwithdraw);
      }

      else if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'TATVIK.TATVIK') {
        vex.dialog.alert("Scan Successful");
        this.QScore = parseInt(this.QScore) + 50;
        this.ministatement.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.ministatement.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.ministatement.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.ministatement.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.ministatement.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.ministatement.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.ministatement.sKey = $(dataXML).find('Skey').text();
        this.ministatement.hMac = $(dataXML).find('Hmac').text();
        this.ministatement.encryptedPID = $(dataXML).find('Data').text();
        this.ministatement.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.cashwithdraw.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.cashwithdraw);
      }


      else if (this.errorData != 0) {
        vex.dialog.alert($(dataXML).find('Resp').attr('errInfo'));
        this.QScore = 0;
      } else {
        vex.dialog.alert("Bad Quality, Please Try Again");
        this.QScoreData = false;
        this.QScore = 0;
      }

    }
  }
  captureAadharpay() {
    let myres = this.regCustomer4();
    if (myres.httpStaus) {
      let dataXML = myres.data;

      if (typeof dataXML === 'string') {
        this.myxmlfetchdata = btoa(dataXML);
      }
      else if (typeof dataXML === 'object') {
        this.myxmlfetchdata = dataXML;
        let mydata2 = new XMLSerializer().serializeToString(this.myxmlfetchdata);
        this.myxmlfetchdata = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?> ${mydata2}`;
        this.myxmlfetchdata = btoa(this.myxmlfetchdata);
      }

      this.QScore = $(dataXML).find('Resp').attr('qScore');
      this.errorData = $(dataXML).find('Resp').attr('errCode');

      if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'Morpho.SmartChip') {
        vex.dialog.alert("Scan Successful");
        this.aadharPay.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.aadharPay.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.aadharPay.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.aadharPay.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.aadharPay.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.aadharPay.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.aadharPay.sKey = $(dataXML).find('Skey').text();
        this.aadharPay.hMac = $(dataXML).find('Hmac').text();
        this.aadharPay.encryptedPID = $(dataXML).find('Data').text();
        this.aadharPay.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.cashwithdraw.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.cashwithdraw);
      }

      else if (this.QScore >= 40 || $(dataXML).find('DeviceInfo').attr('dpId') == 'TATVIK.TATVIK') {
        vex.dialog.alert("Scan Successful");
        this.QScore = parseInt(this.QScore) + 50;
        this.aadharPay.dpId = $(dataXML).find('DeviceInfo').attr('dpId');
        this.aadharPay.rdsId = $(dataXML).find('DeviceInfo').attr('rdsId');
        this.aadharPay.rdsVer = $(dataXML).find('DeviceInfo').attr('rdsVer');
        this.aadharPay.dc = $(dataXML).find('DeviceInfo').attr('dc');
        this.aadharPay.mi = $(dataXML).find('DeviceInfo').attr('mi');
        this.aadharPay.mcData = $(dataXML).find('DeviceInfo').attr('mc');
        this.aadharPay.sKey = $(dataXML).find('Skey').text();
        this.aadharPay.hMac = $(dataXML).find('Hmac').text();
        this.aadharPay.encryptedPID = $(dataXML).find('Data').text();
        this.aadharPay.ci = $(dataXML).find('Skey').attr('ci');
        this.QScoreData = true;
        //this.cashwithdraw.sr_no=$(dataXML).find('Param[name="srno"]').attr('value');
        //console.log(this.cashwithdraw);
      }

      else if (this.errorData != 0) {
        vex.dialog.alert($(dataXML).find('Resp').attr('errInfo'));
        this.QScore = 0;
      } else {
        vex.dialog.alert("Bad Quality, Please Try Again");
        this.QScoreData = false;
        this.QScore = 0;
      }

    }
  }


  do_retry = (tab_value) => {
    this.tab_val = tab_value.tab.textLabel;
  }

  retry_transaction = () => {
    this.fingerPrintModal.hide();
    console.log(this.tab_val);
    if (this.tab_val == "Balance Enquiry") {

      this.submit_balance_Enquiry(1);

    } else if (this.tab_val == "Aadhaar Pay") {

      this.submit_aadharpay(1);

    } else if (this.tab_val == "Ministatement") {

      this.submit_ministatement(1);

    } else {

      this.submit_cashwithdraw(1);

    }

  }

}
