import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
// import jspdf from 'jspdf';
import { jsPDF } from 'jspdf';
import { ToWords } from 'to-words';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  // @ViewChild("screen", { static: false }) screen: ElementRef;
  // @ViewChild("canvas", { static: false }) canvas: ElementRef;
  // @ViewChild("downloadLink", { static: false }) downloadLink: ElementRef;

  @ViewChild('htmlData', {static: false}) htmlData:ElementRef;

  filePreview: string;
  @Output() newItemEvent = new EventEmitter<boolean>();
  @Input() invoiceData_heading: any;
  @Input() invoiceData: any;
  @Input() page: any;
  numWords: any;
  totalsum: any;
  loader: boolean;

  constructor(
    // private sanitizer: DomSanitizer
    ) { }

  ngOnInit() {

    this.numWords = new ToWords();    
 
 
    console.log(this.invoiceData);
    this.invoiceData = this.invoiceData[0];
    console.log(this.invoiceData);

    this.totalsum = this.numWords.convert(this.invoiceData.totalsum, { currency: true });

    console.log(this.totalsum);
    

    if (this.page == 'sale') {
      for (let i = 0; i < this.invoiceData.sellData.length; i++) {
      
        this.invoiceData.sellData.discount = ((this.invoiceData.sellData.discount * 100)/this.invoiceData.sellData.price).toFixed(2);
        this.invoiceData.sellData.cgst = ((this.invoiceData.sellData.cgst * 100)/this.invoiceData.sellData.price).toFixed(2);
        this.invoiceData.sellData.sgst = ((this.invoiceData.sellData.sgst * 100)/this.invoiceData.sellData.price).toFixed(2);
        this.invoiceData.sellData.igst = ((this.invoiceData.sellData.igst * 100)/this.invoiceData.sellData.price).toFixed(2);

        // var base64 = this.getBase64Image(document.getElementById("imageid"));
        // console.log(base64);
        

        // this.invoiceData.prod_img = `data:image/jpeg;base64,${base64}`;
        
      }
    }
    if (this.page == 'quotation') {
      for (let i = 0; i < this.invoiceData.quote_Data.length; i++) {
      
        this.invoiceData.quote_Data.discount = ((this.invoiceData.quote_Data.discount * 100)/this.invoiceData.quote_Data.price).toFixed(2);
        this.invoiceData.quote_Data.cgst = ((this.invoiceData.quote_Data.cgst * 100)/this.invoiceData.quote_Data.price).toFixed(2);
        this.invoiceData.quote_Data.sgst = ((this.invoiceData.quote_Data.sgst * 100)/this.invoiceData.quote_Data.price).toFixed(2);
        this.invoiceData.quote_Data.igst = ((this.invoiceData.quote_Data.igst * 100)/this.invoiceData.quote_Data.price).toFixed(2);

        // this.invoiceData.prod_img = `data:image/jpeg;base64,${this.invoiceData.prod_img}`;
        
      }
    }
    this.invoiceData.total_amount = parseFloat(this.invoiceData.total_amount).toFixed(2);
    this.invoiceData.totalcgst = parseFloat(this.invoiceData.totalcgst).toFixed(2);
    this.invoiceData.totalsgst = parseFloat(this.invoiceData.totalsgst).toFixed(2);
    this.invoiceData.totaligst = parseFloat(this.invoiceData.totaligst).toFixed(2);
    this.invoiceData.totalsum = parseFloat(this.invoiceData.totalsum).toFixed(2);
  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    // canvas.width = img.width;
    // canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  } 

  reverse = () =>{
    this.newItemEvent.emit(true);
  }
  

  

    // print(){

    //   html2canvas(this.screen.nativeElement).then(canvas => {
    //     this.canvas.nativeElement.src = canvas.toDataURL();
    //     this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
    //     this.downloadLink.nativeElement.download = "My-QR-Code.png";
    //     this.downloadLink.nativeElement.click();
    //   });
  

    // }



    async print(){

  //     this.loader =true;
      let dt = Date.now(); 
      console.log(dt);

  //     let DATA = document.getElementById('print');
  //   let doc = new jspdf('p','pt', 'a3');

  //  doc.setProperties({
  //      title: 'invoice'+dt+'.pdf'
  // });
  //  await doc.html(DATA.innerHTML);
  //  window.open(URL.createObjectURL(doc.output("blob")))
   
      

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
        // pdf.autoPrint();
        // window.open(pdf.output(), '_blank');
        // window.print();
  
      });
  
    }

}
