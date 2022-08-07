import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-scrap-consumption',
  templateUrl: './scrap-consumption.component.html',
  styleUrls: ['./scrap-consumption.component.scss']
})
export class ScrapConsumptionComponent implements OnInit {

  @Input() rawmatData;
  @Input() edit;
  @Output() BackTab = new EventEmitter<boolean>()
  
  scrapForm: FormGroup;
  consumptionForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { 
    this.scrapForm = new FormGroup({
      "Scrap": new FormArray([])
    })
    this.consumptionForm = new FormGroup({
      "Consumption": new FormArray([])
    })
  }

  ngOnInit() {

    console.log(this.edit);
    console.log(this.rawmatData);

    var s_form = this.scrapForm.get('Scrap')['controls'];
    console.log(s_form);
    
    for (let i = 0; i < this.rawmatData.scrap_data.length; i++) {
      this.add_row();

      s_form[i].patchValue({
        scrap: this.rawmatData.scrap_data[i].type,
        qty: this.rawmatData.scrap_data[i].qty,
        unit: this.rawmatData.scrap_data[i].unit
      });
      
    } 

    var c_form = this.consumptionForm.get('Consumption')['controls'];
    console.log(c_form);
    
    for (let i = 0; i < this.rawmatData.consumption_data.length; i++) {
      this.add_row2();

      c_form[i].patchValue({
        consumption: this.rawmatData.consumption_data[i].type,
        cost: this.rawmatData.consumption_data[i].cost
      });
      
    } 

  }

    matdata(): FormGroup {
      return this.fb.group({  
        scrap: new FormControl('', [Validators.required]),
        qty: new FormControl('', [Validators.required]),
        unit: new FormControl('', [Validators.required]) 
      })
    }
    matdata2(): FormGroup {
      return this.fb.group({  
        consumption: new FormControl('', [Validators.required]),
        cost: new FormControl('', [Validators.required])
      })
    }
  
    add_row() {
      (<FormArray>this.scrapForm.get('Scrap')).push(this.matdata())
    }   
    add_row2() {
      (<FormArray>this.consumptionForm.get('Consumption')).push(this.matdata2())
    }   

  previousPage() {
    this.BackTab.emit();
  }

  prevent_0(e: any) {
      // return e.keyCode >= 48 && e.charCode <= 57;
      var v = parseInt(e.target.value)

      if (v > 0) {
        return e.keyCode >= 48 && e.charCode <= 57;
      } else {
        return e.keyCode > 48 && e.charCode <= 57;
      }
  }
  prevent_char(e: any) {
      return e.keyCode >= 48 && e.charCode <= 57;
  }

}
