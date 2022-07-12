import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf'; 

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
  @Output() newItemEvent = new EventEmitter<boolean>();
  @Input() invoiceData: any;

  constructor(
    // private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {
    console.log(this.invoiceData);
    
  }
  reverse = () =>{
    this.newItemEvent.emit(true);
  }

    print(){
      let dt = Date.now(); 
      console.log(dt);
      

      var data = document.getElementById('print');  
      html2canvas(data).then(canvas => {  
        // Few necessary setting options  
        var imgWidth = 208;  
        var pageHeight = 295;  
        var imgHeight = canvas.height * imgWidth / canvas.width;  
        var heightLeft = imgHeight;  
        const contentDataURL = canvas.toDataURL('image/png');  
        let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
        var position = 0;  
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);  
        pdf.save('invoice'+dt+'.pdf'); // Generated PDF
  
      });
  
    }

}
