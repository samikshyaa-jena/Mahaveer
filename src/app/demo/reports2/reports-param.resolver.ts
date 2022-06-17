import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";

@Injectable()
export class ReportsParamResolver implements Resolve<any> {
    allowedRoutes = [ 'upi', 'wallet', 'commission', 'cashout', 'insurance', 'bbps', 'matm', 'aeps', 'dmt', 'dmt2', 'recharge', 'unified', 'aadhar' ];

    constructor(
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.allowedRoutes.includes(route.params.service) ? route.params.service : this.router.navigate(['/dashboard/analytics']);
    }
}