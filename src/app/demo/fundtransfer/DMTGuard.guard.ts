import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { FundtransferService } from "./fundtransfer.service";

@Injectable({
  providedIn: 'root'
})
export class DMTGuard implements CanActivate {
  constructor(private router: Router, private fundTransferService: FundtransferService, private ngxSpinner: NgxSpinnerService) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
          this.ngxSpinner.show("dmtFeatureSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
          const allow = await this.checkDMT();  
          console.log('Allow: ', allow);
          if (allow) { return true; }
          else {
            this.router.navigate(['/v1/fundtransfer/forbidden'])
          }
          return false;
    }

    checkDMT() {
        return new Promise((resolve, rej) => {
            this.fundTransferService.checkDMTFeature()
            .pipe(finalize(() => {
              this.ngxSpinner.hide('dmtFeatureSpinner'); 
          }))
            .subscribe(
                (res: any) => {
                    console.log('DMT Feature Response: ', res);
                    const feature = res.userFeature.find(feature => feature.id == 60);
                    // feature.active = false;
                    if (feature.active) { resolve(true); }
                    resolve(false);
                },
                err => {
                    console.log('DMT Feature Error: ', err);
                    // this.router.navigate(['/dashboard/analytics'])
                    resolve(false);
                }
            );
        });
    }
}
