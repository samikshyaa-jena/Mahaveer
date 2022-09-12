import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as vex from 'vex-js';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AadharPayService } from "../aadhar-pay.service";
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { analytics } from 'firebase';
import { AuthConfig } from 'src/app/app-config';
import { AppService } from "src/app/app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Socket3Service } from "src/app/socket3.service";
import { aadharAllApi } from '../aadharPayApi';
import jwt_decode from 'jwt-decode';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import "../../aeps/string.d.ts"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AgmMap, MapsAPILoader } from '@agm/core';
import * as io from 'src/assets/socket.io.min.js'
import { aepsAllApi } from '../../aeps/aeps.api';

@Component({
  selector: 'app-aadhar-pay',
  templateUrl: './aadhar-pay.component.html',
  styleUrls: ['./aadhar-pay.component.scss']
})

// old code starts
export class AadharPayComponent implements OnInit {
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
  vid_ap: boolean;


  constructor(private firestore: AngularFirestore,
    private aadharPayService: AadharPayService,
    private ngxSpinner: NgxSpinnerService,
    private apiloader: MapsAPILoader,
    private http: HttpClient,
    private socketService3: Socket3Service,
    private appService: AppService
  ) {
    (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
    this.ipload();
    this.checkvalidForAadhar = true;
    this.rblLogoUrl = "";
    navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.latlng = `${this.lat},${this.lng}`
    });

    this.modeselect = "option1";
    this.mytabopened = "Cash Withdraw";
    this.balanceEnquiryresfetch = false;
    this.ministatementresfetch = false;
    this.Aadharpayfetch = false;

    this.aepsformAP = new FormGroup({
      mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[6-9][0-9]{9}$/)]),
      cwadh1: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh2: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4,}$/)]),
      cwadh3: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4,}$/)]),
      bankname: new FormControl('', null),
      amountdetails: new FormControl('', [Validators.required]),
      bankinfo: new FormControl('', null),
      vid_no: new FormControl('', null),
    });
    this.firestore.collection('IIN').snapshotChanges().subscribe(
      res => {
        if (res) {
          res.forEach((doc: any) => {
            this.exampleItems.push({ BANKNAME: doc.payload.doc.Df.key.path.segments[6], IIN: doc.payload.doc.Df.sn.proto.mapValue.fields.IIN.stringValue });
            this.bankList = this.exampleItems;
          })
        } else {
        }
      },
      err => { });
  };
  async ipload() {
    const encodeUrl = await AuthConfig.config.encodeUrl(aepsAllApi.url.ipdata);
    this.http.get(encodeUrl).subscribe(
      res => { });
  };

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
  };

  public inputValidator(event: any) {
    const pattern = /^[0-9]{4}$/;
    if (!pattern.test(event.target.value)) {
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
          this.checkvalidForAadhar = this.totalaadhar.verhoeffCheck();
        }
      }
    }
  };
  change_modal = () => {
    this.fingerPrintModal.show();
  };
  public inputValidator1(event: any) {
    const pattern = /^[0-9]{4}$/;
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
          this.checkvalidForAadhar = this.totalaadhar.verhoeffCheck();
        }
      }
    }
    else if (event.inputType === 'deleteContentBackward' && event.target.value.length == 0) {
      $('#cwadh1').focus()
      this.myaadharvalidationCwadh2 = "";
      this.checkvalidForAadhar = true;
    }
  };
  public inputValidator2(event: any) {
    if (event.target.value.length == 4) {
      this.myaadharvalidationCwadh3 = event.target.value;
      if (typeof (this.myaadharvalidationCwadh1) !== "undefined" && typeof (this.myaadharvalidationCwadh2) !== "undefined") {
        this.totalaadhar = `${this.myaadharvalidationCwadh1}${this.myaadharvalidationCwadh2}${this.myaadharvalidationCwadh3}`;
        this.checkvalidForAadhar = this.totalaadhar.verhoeffCheck();
      }
    }
    else {
      this.myaadharvalidationCwadh3 = "";
    }
    const pattern = /^[0-9]{4}$/;
    if (!pattern.test(event.target.value)) {
      if (event.target.value > 4) {
        event.target.value = event.target.value.substring(0, 4);
      }
      else if (event.inputType === 'deleteContentBackward' && event.target.value.length == 0) {
        $('#cwadh2').focus()
        this.checkvalidForAadhar = true;
      }
    }
  };
  ngAfterViewInit() {
  };
  searhBankNameAP = (e) => {
    console.log(e);
    e = e.toLowerCase();
    this.bankListAP = this.exampleItems.filter(bName => bName.BANKNAME.toLowerCase().startsWith(e));
  }
  displayFn(product): string {
    return product ? product.BANKNAME : product;
  };
  radiovalue(data) {
    this.radioBankName1 = data;
    this.aepsform.get('bankname').setValue(".");
    let x = this.aepsform.get('bankname').value.IIN
    if (data != 606985 || x != 607280 || x != 606993) {
      this.validAmount = false;
    }
  };

  radiovalueAP(data) {
    this.radioBankNameAP1 = data;

    let x = this.aepsformAP.get('bankname').value.IIN
    if (data != 606985 || x != 607280 || x != 606993) {

      this.validAmountAp = false;
    }
  };
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
  };
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
  };



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
  };


  connectSocketAP() {
    this.socketService3.setupSocket();
    const socketSub = this.socketService3.socketData
      .pipe(takeUntil(this.unsub))
      .subscribe((data: any) => {
        if (data) {
          setTimeout(() => {
            // this.appService.fetchWalletBalance();
          }, 2000);

          this.aadhaarpay_socketdis = data;
          console.log(this.aadhaarpay_socketdis, "beforeSocket");
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
            this.confirmModalAP_socket.show();
          }
          socketSub.unsubscribe();
          this.socketService3.disconnectSocket();
        }
        this.ngxSpinner.hide('elasticSpinner');
      });
  };
  async aadharpayaftersocket() {
    this.confirmModalAP_socket.hide();
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    const encodeUrl = await AuthConfig.config.encodeUrl(`https://aepscomposer.iserveu.tech/transactionEnquiry/${this.aadharpayres.txId}`);
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
        console.log(res, "afterSocket");

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
  };

  onChangematSlide(e) {
    this.matchecked = e.checked
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
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
        vex.dialog.alert(res.results.message)
      },
      err => {
        this.ngxSpinner.hide('elasticSpinner');
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
    this.aadharPay.shakey = this.sha256(this.aadharPay.aadharNo);
    const encodeUrl = await AuthConfig.config.encodeUrl(aadharAllApi.url.aadharPay);
    if (parseInt(this.radioBankNameAP)) {
      this.aadharPayService.aadharPay(encodeUrl, this.aadharPay).subscribe(
        (res: any) => {
          this.connectSocketAP();
          this.aadharpayres = res;
        },
        (err: any) => {
          if (err.error.kycActiveStatus == "5") {
            vex.dialog.alert(err.error.error);
          } else {
            vex.dialog.alert(err.error.transactionStatus);
          }
          this.ngxSpinner.hide('elasticSpinner');
          this.Aadharpayfetch = false;
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
  }

  generatePDFAP(action = 'open') {
    var rblLogoUrl3
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
        resolve('ok');
      });
    })
    mypromise.then(res => {
      if (res) {
        this.rblLogoUrl = rblLogoUrl3
        const user: { sub: string } = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
        var userName = user.sub;
        let docDefinition = {
          pageSize: 'A4',
          pageMargins: [40, 40, 40, 40],
          content: [{//start
            pageSize: 'A4',
            columns: [
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
                body: [
                  [{
                    text: 'Date : ' + this.aadhaarpay_socketdis.updatedDate,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'User Name : ' + userName,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  [{
                    text: `BC Agent Id: ${this.aadhaarpay_socketdis.bcId}`,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'Amount: Rs.' + this.aadharPay.amount,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'Contact: ' + this.aadharPay.mobileNumber,
                    fontSize: 10,
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
                  [{
                    text: 'Customer Aadhaar No. : ' + this.aadhaarpay_socketdis.origin_identifier,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'RRN : ' + this.aadhaarpay_socketdis.apiTid,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
                  [{
                    text: 'Transaction Status : ' + this.aadhaarpay_socketdis.status,
                    fontSize: 10,
                    border: [false, false, false, false]
                  }],
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
          let qscore = data;
          httpStaus = true;
          res = {
            data: data,
            httpStaus: httpStaus,
          };
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          vex.dialog.alert(thrownError)
          res = {
            httpStaus: httpStaus,
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
          httpStaus = true;
          res = {
            data: data,
            httpStaus: httpStaus,
          };
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          vex.dialog.alert(`${thrownError} If you are using tatvik device then select the Device from Drop down`)
          res = {
            httpStaus: httpStaus,
          };
        },
      });
      return res
    }
  }
  captureFingerPrint() {
    let myres = this.regCustomer4();
    if (myres.httpStaus) {
      this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
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
        this.ngxSpinner.hide('elasticSpinner');
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
        this.ngxSpinner.hide('elasticSpinner');
      }
      else if (this.errorData != 0) {
        vex.dialog.alert($(dataXML).find('Resp').attr('errInfo'));
        this.QScore = 0;
        this.ngxSpinner.hide('elasticSpinner');
      } else {
        vex.dialog.alert("Bad Quality, Please Try Again");
        this.QScoreData = false;
        this.QScore = 0;
        this.ngxSpinner.hide('elasticSpinner');
      }
    }
  }
  captureAadharpay() {
    let myres = this.regCustomer4();
    if (myres.httpStaus) {
      this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
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
        this.ngxSpinner.hide('elasticSpinner');
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
        this.ngxSpinner.hide('elasticSpinner');
      }
      else if (this.errorData != 0) {
        vex.dialog.alert($(dataXML).find('Resp').attr('errInfo'));
        this.QScore = 0;
        this.ngxSpinner.hide('elasticSpinner');
      } else {
        vex.dialog.alert("Bad Quality, Please Try Again");
        this.QScoreData = false;
        this.QScore = 0;
        this.ngxSpinner.hide('elasticSpinner');
      }
    }
  }
  do_retry = (tab_value) => {
    this.submit_aadharpay(1);
    this.tab_val = tab_value.tab.textLabel;
  }

  reset_ap_obj(){
        Object.keys(this.aadharPay).forEach(key => {
          this.aadharPay[key] = null;
        });
      };

change_mode = (e) => {
  console.log(e);
  this.QScoreData = false;
    this.reset_ap_obj();
    if (e.checked == true) {
      this.vid_ap = true;
      this.aepsformAP.get('vid_no').setValidators(Validators.required);
      this.aepsformAP.controls['cwadh1'].clearValidators();
      this.aepsformAP.controls['cwadh2'].clearValidators();
      this.aepsformAP.controls['cwadh3'].clearValidators();
    } else {
      this.vid_ap = false;
      this.aepsformAP.get('cwadh1').setValidators(Validators.required);
      this.aepsformAP.get('cwadh2').setValidators(Validators.required);
      this.aepsformAP.get('cwadh3').setValidators(Validators.required);
      this.aepsformAP.get('vid_no').clearValidators();
    }
    this.aepsformAP.get('vid_no').updateValueAndValidity();
    this.aepsformAP.get('cwadh1').updateValueAndValidity();
    this.aepsformAP.get('cwadh2').updateValueAndValidity();
    this.aepsformAP.get('cwadh3').updateValueAndValidity();
    this.aepsformAP.get('vid_no').updateValueAndValidity();
    this.aepsformAP.get('cwadh1').updateValueAndValidity();
    this.aepsformAP.get('cwadh2').updateValueAndValidity();
    this.aepsformAP.get('cwadh3').updateValueAndValidity();
  }
}


// old code ends
