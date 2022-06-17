import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthConfig } from 'src/app/app-config';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-aeps-stag',
  templateUrl: './aeps-stag.component.html',
  styleUrls: ['./aeps-stag.component.scss']
})
export class AepsStagComponent implements OnInit {
  bioAuth: boolean = true;
  fetchingData: boolean;

  constructor(
    private http: HttpClient,
    private ngxSpinner: NgxSpinnerService,
  ) {}

  ngOnInit() {
    this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
    this.bio_auth();    
  }

  bio_auth = async () => {
    let url = 'https://vpn.iserveu.tech/AEPSFRM/viewUserPropAddress';
    const encoded_url = await AuthConfig.config.encodeUrl(url);
    this.http.get(encoded_url).subscribe(
      (res: any) => {
        this.ngxSpinner.hide('elasticSpinner');
        console.log(res);
        this.bioAuth = res.response.bioauth;
        console.log(this.bioAuth);
      },
      (err: any) => {
        this.ngxSpinner.hide('elasticSpinner');
        console.log(err);
        
      }
    );
  }

}
