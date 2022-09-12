import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class FundtransferService {
  // BASE_URL = 'https://dmtransaction.iserveu.website/';
  // BASE_URL = 'https://dmt-transaction-twdwtabx5q-el.a.run.app/';
  // BASE_URL = 'https://dmtfino.iserveu.website/TXNMODULE/';
  // BASE_URL = 'https://dmtfino.iserveu.website/TXNMODULE/';
  // RRN_URL = 'https://dmtfino.iserveu.website/GATEWAY/';
  BASE_URL = 'https://dmttest.iserveu.online/TXNMODULE/';
  RRN_URL = 'https://dmttest.iserveu.online/GATEWAY/';
  // BASE_URL = 'http://35.244.34.62:8081/TXNMODULE/';
  // RRN_URL = 'http://35.244.34.62:8081/GATEWAY/';
  
  // transferData = new Subject();
  transferData = new BehaviorSubject({
      customerData: { valid: false },
      beneData: { valid: false },
      amount: 0,
      date: new Date(),
      mode: 'IMPS',
      showAmtForm: true
  });

  constructor(
    private http: HttpClient
  ) { }

  addCustomer(postData: { mobileNumber: string, name: string }) {
    return this.http.post(`${this.BASE_URL}add-customer`, postData);
  }

  verifyOTP(postData: { mobileNumber: string, otp: string }) {
    return this.http.post(`${this.BASE_URL}verify-customer`, postData);
  }

  resendOTP(postData: { mobileNumber: string }) {
    return this.http.post(`${this.BASE_URL}resend-otp/${postData.mobileNumber}`, {});
  }

  getCustomer(postData: { mobileNumber: string }) {
    return this.http.post(`${this.BASE_URL}get-customer/${postData.mobileNumber}`, {});
  }

  addBeneficiary(postData: any) {
    return this.http.post(`${this.BASE_URL}add-bene`, postData);
  }

  searchBank(eData) {
    const elasticURL = 'https://b61295e3bdc84097ac04e0456792cac1.us-central1.gcp.cloud.es.io:9243/isu_bank/_search';
    return this.http.post(elasticURL, eData);
  }

  changeBeneStaus(postData: { id: number }) {
    return this.http.post(`${this.BASE_URL}delete-bene`, postData);
  }

  verifyBene(postData: any) {
    return this.http.post(`${this.BASE_URL}verify-bene`, postData);
  }

  transferMoney(postData: any) {
    return this.http.post(`${this.BASE_URL}transferreq`, postData);
    // return this.http.post(`http://192.168.1.95:8080/transferreq`, postData);
  }

  updateBene(beneData: any) {
    return this.http.post(`${this.BASE_URL}update-bene`, beneData);
    // return this.http.post(`https://dmt-transaction-twdwtabx5q-el.a.run.app/update-bene`, beneData);
  }

  fetchRRN(txnID: string) {
    return this.http.post(`${this.RRN_URL}gateway-txns/${txnID}`, {});
  }

  fetchShopName(url: string, postData: { transactionID: number }) {
    return this.http.post(url, postData);
  }

  fetchShopName2() {
    return this.http.get('https://wallet.iserveu.online/CORESTAGING/user/user_details');
  }

  // fetchWalletBalance(postData: { user_name: string }) {
  //   return this.http.post('https://grpcwallet-vn3k2k7q7q-uc.a.run.app/wallet/checkbalance', postData);
  // }

  checkDMTFeature() {
    const tokenData: {sub: string} = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
    return this.http.post('https://feature-twdwtabx5q-el.a.run.app/fetch_user_feature', {user_name: tokenData.sub});
  }
}
