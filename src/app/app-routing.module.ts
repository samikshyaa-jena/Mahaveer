import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './demo/error/error.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthGuard } from './guards/auth.guard'
import { DepositslipComponent } from './depositslip/depositslip.component';

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
    ]
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)
  },
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
