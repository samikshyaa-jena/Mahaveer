import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
// import * as jsPDF from 'jspdf';  
// import { DomSanitizer } from '@angular/platform-browser'; 

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  @ViewChild("screen", { static: false }) screen: ElementRef;
  @ViewChild("canvas", { static: false }) canvas: ElementRef;
  @ViewChild("downloadLink", { static: false }) downloadLink: ElementRef;
  filePreview: string;

  constructor(
    // private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
  }

  print(){
    // this.download = true;
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();

      // const doc = new jsPDF();  
      // const base64ImgString = canvas.toDataURL("image/png");  
      // doc.addImage(base64ImgString, 15, 40, 50, 50);  
      // this.filePreview = 'data:image/png' + ';base64,' + base64ImgString;  
      // doc.save('TestPDF')  ;
      this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
      this.downloadLink.nativeElement.download = "My-QR-Code.png";
      this.downloadLink.nativeElement.click();
      // this.download = false;
    });
  }

}
