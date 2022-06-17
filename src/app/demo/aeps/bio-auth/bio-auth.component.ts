import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthConfig } from "src/app/app-config";
import { MatTabsModule } from "@angular/material/tabs";
import { Router } from "@angular/router";
import * as vex from "vex-js";
import * as $ from "jquery";

@Component({
  selector: "app-bio-auth",
  templateUrl: "./bio-auth.component.html",
  styleUrls: ["./bio-auth.component.scss"],
})
export class BioAuthComponent implements OnInit, AfterViewInit {
  @ViewChild("showPinModal", { static: false }) private pinModal: any;
  @ViewChild("showAadharModal", { static: false }) private aadharModal: any;
  @ViewChild("showFingerPrintModal", { static: false })
  private fingerPrintModal: any;

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
    gatewayPriority: "",
  };

  pinCodeForm: FormGroup;
  aadharForm: FormGroup;
  login_user: any;
  QScore: any = 0;
  modeselect: any;
  myxmldata: any;
  errorData: any;
  QScoreData: boolean;

  constructor(
    private http: HttpClient,
    private ngxSpinner: NgxSpinnerService,
    private router: Router
  ) {}
  ngAfterViewInit() {
    this.pinModal.show();
  }

  ngOnInit() {
    this.pinCodeForm = new FormGroup({
      pin_code: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[1-9]{1}[0-9]{5}$/),
      ]),
    });

    this.aadharForm = new FormGroup({
      aadhar_no: new FormControl("", [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(16),
      ]),
      // iin: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      // pc: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
    });
  }

  regCustomer4 = () => {
    var res;
    var httpStaus = false;
    if (this.modeselect === "option5") {
      $.ajax({
        type: "CAPTURE",
        async: false,
        crossDomain: true,
        url: "http://127.0.0.1:11101/rd/capture",
        data: "<PidOptions ver='1.0'><Opts env='PP' fCount='1' fType='0' format='0' pType='0' pCount='0' pgCount='0' pTimeout='20000' pidVer='2.0'></Opts><Demo></Demo><CustOpts></CustOpts><Bios></Bios></PidOptions>",
        contentType: "text/xml; charset=utf-8",
        processData: false,
        success: function (data) {
          console.log(data);
          let qscore = data;
          console.log(this.QScore);
          httpStaus = true;
          res = {
            data: data,
            httpStaus: httpStaus,
          };
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          console.log(thrownError);
          console.log(jqXHR);
          vex.dialog.alert(thrownError);
          res = {
            httpStaus: httpStaus,
          };
        },
      });
      return res;
    } else {
      $.ajax({
        type: "CAPTURE",
        async: false,
        crossDomain: true,
        url: "http://127.0.0.1:11100/rd/capture",
        data: '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="0" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" posh="" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>',
        // data: '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="0" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" posh="" env="PP" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>',
        contentType: "text/xml; charset=utf-8",
        processData: false,
        success: function (data) {
          console.log(data);
          let qscore = data;
          console.log(this.QScore);
          httpStaus = true;
          res = {
            data: data,
            httpStaus: httpStaus,
          };
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          console.log(thrownError);
          console.log(jqXHR);
          vex.dialog.alert(
            `${thrownError} If you are using tatvik device then select the Device from Drop down`
          );
          res = {
            httpStaus: httpStaus,
          };
        },
      });
      return res;
    }
  };

  captureFingerPrint() {
    let myres = this.regCustomer4();
    if (myres.httpStaus) {
      let dataXML = myres.data;

      if (typeof dataXML === "string") {
        this.myxmldata = btoa(dataXML);
      } else if (typeof dataXML === "object") {
        this.myxmldata = dataXML;
        let mydata2 = new XMLSerializer().serializeToString(this.myxmldata);
        this.myxmldata = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?> ${mydata2}`;
        this.myxmldata = btoa(this.myxmldata);
      }

      this.QScore = $(dataXML).find("Resp").attr("qScore");
      this.errorData = $(dataXML).find("Resp").attr("errCode");

      if (
        this.QScore >= 40 ||
        $(dataXML).find("DeviceInfo").attr("dpId") == "Morpho.SmartChip"
      ) {
        vex.dialog.alert("Scan Successful");
        this.fingerData.dpId = $(dataXML).find("DeviceInfo").attr("dpId");
        this.fingerData.rdsId = $(dataXML).find("DeviceInfo").attr("rdsId");
        this.fingerData.rdsVer = $(dataXML).find("DeviceInfo").attr("rdsVer");
        this.fingerData.dc = $(dataXML).find("DeviceInfo").attr("dc");
        this.fingerData.mi = $(dataXML).find("DeviceInfo").attr("mi");
        this.fingerData.mcData = $(dataXML).find("DeviceInfo").attr("mc");
        this.fingerData.sKey = $(dataXML).find("Skey").text();
        this.fingerData.hMac = $(dataXML).find("Hmac").text();
        this.fingerData.encryptedPID = $(dataXML).find("Data").text();
        this.fingerData.ci = $(dataXML).find("Skey").attr("ci");
        this.QScoreData = true;
      } else if (
        this.QScore >= 40 ||
        $(dataXML).find("DeviceInfo").attr("dpId") == "TATVIK.TATVIK"
      ) {
        vex.dialog.alert("Scan Successful");
        this.QScore = parseInt(this.QScore) + 50;
        this.fingerData.dpId = $(dataXML).find("DeviceInfo").attr("dpId");
        this.fingerData.rdsId = $(dataXML).find("DeviceInfo").attr("rdsId");
        this.fingerData.rdsVer = $(dataXML).find("DeviceInfo").attr("rdsVer");
        this.fingerData.dc = $(dataXML).find("DeviceInfo").attr("dc");
        this.fingerData.mi = $(dataXML).find("DeviceInfo").attr("mi");
        this.fingerData.mcData = $(dataXML).find("DeviceInfo").attr("mc");
        this.fingerData.sKey = $(dataXML).find("Skey").text();
        this.fingerData.hMac = $(dataXML).find("Hmac").text();
        this.fingerData.encryptedPID = $(dataXML).find("Data").text();
        this.fingerData.ci = $(dataXML).find("Skey").attr("ci");
        this.QScoreData = true;
      } else if (this.errorData != 0) {
        vex.dialog.alert($(dataXML).find("Resp").attr("errInfo"));
        this.QScore = 0;
      } else {
        vex.dialog.alert("Bad Quality, Please Try Again");
        this.QScoreData = false;
        this.QScore = 0;
      }
    }
  }

  validate_pinCode = async () => {
    this.pinModal.hide();
    this.ngxSpinner.show("elasticSpinner", {
      bdColor: "rgba(0, 0, 0, 0.5)",
      type: "timer",
    });
    let url =
      "https://us-central1-creditapp-29bf2.cloudfunctions.net/pincodeFetch/api/v1/getCitystate";
    let pin = parseInt(this.pinCodeForm.get("pin_code").value);
    let reqBody = {
      pin: pin,
    };
    const encoded_url = await AuthConfig.config.encodeUrl(url);
    this.http.post(encoded_url, reqBody).subscribe(
      (res: any) => {
        this.updateUserPropAddress(res);
        this.ngxSpinner.hide("elasticSpinner");
        console.log(res);
        this.login_user = JSON.parse(
          sessionStorage.getItem("dashboardData")
        ).userInfo.userName;
        this.aadharModal.show();
      },
      (err: any) => {
        console.log(err);
        if (err.status == 500) {
          this.ngxSpinner.hide("elasticSpinner");
          vex.dialog.alert(err.error.data.statusDesc);
        }
        this.navTodash();
      }
    );
  };

    // address update starts
    updateUserPropAddress = async (r) => {
      console.log(r);
      let latLong = JSON.parse(atob('eyJsYXRpdHVkZSI6MjAuMzQwMTE4NSwibG9uZ2l0dWRlIjo4NS43OTc0MDQxfQ=='));
      console.log(latLong);
      let convertedLatLong = latLong.latitude.toString()+","+ latLong.longitude.toString();  


      // localStorage.setItem('lctnCordn', btoa(JSON.stringify({latitude,longitude}))); 

      this.ngxSpinner.show("elasticSpinner", {
        bdColor: "rgba(0, 0, 0, 0.5)",
        type: "timer",
      });
      let url = "https://vpn.iserveu.tech/AEPSFRM/updateUserPropAddress";
      let reqBody =
      {
        "state":r.data.data.state,
        "pincode":r.data.data.pincode,
        "city":r.data.data.city,
        "latLong":convertedLatLong
      };
  
      const encoded_url = await AuthConfig.config.encodeUrl(url);
      this.http.post(encoded_url, reqBody).subscribe(
        (res: any) => {
          this.ngxSpinner.hide("elasticSpinner");
          console.log(res);
        },
        (err: any) => {
          console.log(err);
        }
      );
    };
      // address update ends

  change_modal = () => {
    this.aadharModal.hide();
    this.fingerPrintModal.show();
  };
  navTodash = () => {
    this.router.navigate(["/v1/dashboard/analytics"]);
  };


  // bioAuth update
  validate_aadhar = async () => {
    this.ngxSpinner.show("elasticSpinner", {
      bdColor: "rgba(0, 0, 0, 0.5)",
      type: "timer",
    });
    let url = "https://vpn.iserveu.tech/AEPSFRM/aeps2/ibl/bioAuth";
    let aadhar_no = parseInt(this.aadharForm.get("aadhar_no").value);
    let reqBody = {
      aadharNo: aadhar_no,
      dpId: this.fingerData.dpId,
      rdsId: this.fingerData.rdsId,
      rdsVer: this.fingerData.rdsVer,
      dc: this.fingerData.dc,
      mi: this.fingerData.mi,
      mcData: this.fingerData.mcData,
      sKey: this.fingerData.sKey,
      hMac: this.fingerData.hMac,
      encryptedPID: this.fingerData.encryptedPID,
      ci: this.fingerData.ci,
      operation: "",
    };

    const encoded_url = await AuthConfig.config.encodeUrl(url);
    this.http.post(encoded_url, reqBody).subscribe(
      (res: any) => {
        this.ngxSpinner.hide("elasticSpinner");
        console.log(res);
        vex.dialog.alert(res.message);
        this.fingerPrintModal.hide();
      },
      (err: any) => {
        console.log(err);
        if (err.error.status == "-1") {
          vex.dialog.alert(
            "Your Profile is not updated. Please get in touch with your admin for updating the details"
          );
        } else {
          vex.dialog.alert(err.error.message);
        }
        this.navTodash();
      }
    );
  };

  // for testing bioAuth with iin

  // validate_aadhar = async () => {
  //   this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
  //   // let url = 'https://aepsfrm.iserveu.online/AEPSFRM/aeps2/ibl/bioAuth';
  //   // let url = 'https://103.11.154.22:443/aeps/bioauth';
  //   let url = 'https://aepsfrm.iserveu.online/AEPSFRM/aeps2/ibl/bioAuth';
  //   let aadhar_no = parseInt(this.aadharForm.get('aadhar_no').value);
  //   let iin_input = this.aadharForm.get('iin').value;
  //   let pc = this.aadharForm.get('pc').value;
  //   let reqBody = {
  //     "mobileNumber": "8658046294",
  //     "aadharNo": aadhar_no,
  //     "iin": iin_input,
  //     "purposeCode": pc,
  //     "latLong": "20.3401185,85.7974041",
  //     "amount": "",
  //     "dpId": this.fingerData.dpId,
  //     "rdsId": this.fingerData.rdsId,
  //     "rdsVer": this.fingerData.rdsVer,
  //     "dc": this.fingerData.dc,
  //     "mi": this.fingerData.mi,
  //     "mcData": this.fingerData.mcData,
  //     "encryptedPID": this.fingerData.encryptedPID,
  //     "ci": this.fingerData.ci,
  //     "operation": "",
  //     "isBe": true,
  //     "hMac": this.fingerData.hMac,
  //     "freshnessFactor": "default",
  //     "apiUser": "WEBUSER",
  //     "sKey": this.fingerData.sKey,
  //     "shakey": this.fingerData.shakey
  //   }

  //   const encoded_url = await AuthConfig.config.encodeUrl(url);
  //   this.http.post(encoded_url, reqBody).subscribe(
  //     (res: any) => {
  //       this.ngxSpinner.hide('elasticSpinner');
  //       console.log(res);
  //       vex.dialog.alert(res.message);
  //       this.fingerPrintModal.hide();
  //     },
  //     (err: any) => {
  //       console.log(err);
  //       this.navTodash();
  //     }
  //   );
  // }

  omit_char(event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  omit_special_char(event) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }
}
