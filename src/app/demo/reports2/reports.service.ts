import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }
    
  transactionAPI(encURL, reportData: any) {
    return this.http.post(encURL, reportData);
  }

  fetchuserAPI(encURL) {
    return this.http.get(encURL);
  }

  eUsersAPI(eData: any) {
    const elasticURL = 'https://b61295e3bdc84097ac04e0456792cac1.us-central1.gcp.cloud.es.io:9243/isu_elastic_user/_search';
    return this.http.post(elasticURL, eData);
  }

  transRetryAPI(txnID: number) {
    return this.http.post(`https://dmttest.iserveu.online/GATEWAY/manual-retry/${txnID}`, {});
  }

  generateExcel(data: Array<any>, selCols = []) {
    const selectedCols = selCols.map(col => col.prop);
    const keys = Object.keys(data[0]);
    const selectedRecords = keys.filter(col => selectedCols.includes(col));

    const formattedData = data.map(record => { 
      const frecord = {...record};
      frecord.Id = `#${frecord.Id}`;
      frecord.createdDate = `${this.datePipe.transform(frecord.createdDate, 'M/d/y H:mm')}`;
      frecord.updatedDate = `${this.datePipe.transform(frecord.updatedDate, 'M/d/y H:mm')}`;
      frecord.gateWayData = (typeof frecord.gateWayData === 'object') ? frecord.gateWayData.map(data => JSON.stringify(data)).join(', ') : frecord.gateWayData;
      return frecord; 
    });


    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData, { header: [...selectedRecords] });
    const range = XLSX.utils.decode_range(ws['!ref']);
    range.e['c'] = selectedRecords.length - 1;
    ws['!ref'] = XLSX.utils.encode_range(range);
    const wb: XLSX.WorkBook = {Sheets: {Sheet1: ws}, SheetNames: ['Sheet1']};
    XLSX.writeFile(wb, 'report.csv');
  }
}
