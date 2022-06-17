import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './demo/error/error.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthGuard } from './guards/auth.guard'
import { DepositslipComponent } from './depositslip/depositslip.component';
// import { OperatorComponent } from './demo/operator/operator.component';

const routes: Routes = [
  {
    path: 'v1',
    canActivate: [AuthGuard],
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard/analytics',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./demo/dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: 'manufacture',
        loadChildren: () => import('./demo/ERP/manufacture/manufacture.module').then(module => module.ManufactureModule)
      },
      {
        path: 'trade',
        loadChildren: () => import('./demo/ERP/trade/trade.module').then(module => module.TradeModule)
      },

      // erp path ends
      // {
      //   path: 'fundtransfer',
      //   // loadChildren: () => import('./demo/reports/reports.module').then(module => module.ReportModule)
      //   loadChildren: () => import('./demo/fundtransfer/fundtransfer.module').then(module => module.FundtransferModule)
      // },
      // {
      //   path: 'AEPS',
      //   // loadChildren: () => import('./demo/reports/reports.module').then(module => module.ReportModule)
      //   loadChildren: () => import('./demo/aeps/aeps.module').then(module => module.AepsModule)
      // },
      // {
      //   path: 'aadharPay',
      //   // loadChildren: () => import('./demo/reports/reports.module').then(module => module.ReportModule)
      //   loadChildren: () => import('./demo/aadhar-pay/aadhar-pay.module').then(module => module.AadharPayModule)
      // },
      // {
      //   path: 'reports',
      //   canActivate: [AuthGuard],
      //   // loadChildren: () => import('./demo/reports/reports.module').then(module => module.ReportModule)
      //   loadChildren: () => import('./demo/reports2/reports.module').then(module => module.ReportsModule)
      // },
      // {
      //   path: 'cashout',
      //   canActivate: [AuthGuard],
      //   loadChildren: () => import('./demo/cashout/cashout.module').then(module => module.CashoutModule)
      // },
      // {
      //   path: 'payment',
      //   canActivate: [AuthGuard],
      //   loadChildren: () => import('./demo/payment/payment.module').then(module => module.PaymentModule)
      // },
    ]
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)
  },
  // {
  //   path: 'depositslip',
  //   component: DepositslipComponent
  // },
  {
    path: '**',
    pathMatch: 'full',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
