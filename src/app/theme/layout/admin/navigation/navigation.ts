import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    url: '/v1/dashboard/analytics',
    icon: 'feather icon-home'
  },

  // {
  //   id: 'ui-element',
  //   title: 'UI ELEMENT & FORMS',
  //   type: 'group',
  //   icon: 'feather icon-layers',
  //   children: [
  //     {
  //       id: 'dashboard',
  //       title: 'Dashboard',
  //       type: 'item',
  //       url: '/v1/dashboard/analytics',
  //       icon: 'feather icon-home'
  //     },
  //   ]
  // },
  {
    id: 'services',
    title: 'SERVICES',
    type: 'group',
    icon: 'feather icon-layers',
    children: [
      {
        id: 'catagory',
        title: 'Catagory',
        type: 'item',
        url: '/v1/manufacture/catagory',
        icon: 'feather icon-link'
      },
      {
        id: 'vendor',
        title: 'Vendor',
        type: 'item',
        url: '/v1/manufacture/vendor',
        icon: 'feather icon-paperclip'
      },
      {
        id: 'purchase_parent',
        title: 'Purchase',
        type: 'collapse',
        icon: 'feather icon-menu',
        children: [
          {
            id: 'purchase',
            title: 'Purchase',
            type: 'item',
            url: '/v1/manufacture/purchase'
          },
          // {
          //   id: 'credit',
          //   title: 'Credit Note',
          //   type: 'item',
          //   url: '/v1/erp/manufacture'
          // },
          {
            id: 'debit',
            title: 'Debit Note',
            type: 'item',
            url: '/v1/manufacture/debit'
          },
        ]
      },
      {
        id: 'stock',
        title: 'Stock',
        type: 'item',
        url: '/v1/manufacture/stock',
        icon: 'feather icon-shopping-cart'
      },
      {
        id: 'scrap',
        title: 'Scrap',
        type: 'item',
        url: '/v1/manufacture/scrap',
        icon: 'feather icon-trash'
      },
      {
        id: 'product',
        title: 'Product-(Manuf)',
        type: 'item',
        url: '/v1/manufacture/product',
        icon: 'feather icon-book'
      },
      {
        id: 'sale_parent',
        title: 'Sale-(Trade)',
        type: 'collapse',
        icon: 'feather icon-menu',
        children: [
          {
            id: 'sale',
            title: 'Sale',
            type: 'item',
            url: '/v1/trade/sale'
          },
          {
            id: 'credit_sale',
            title: 'Credit Note',
            type: 'item',
            url: '/v1/trade/credit'
          },
          {
            id: 's_quotation',
            title: 'Quotation',
            type: 'item',
            // url: '/v1/trade/sale-quotation',
            pri_sta2: true,
            icon: 'feather icon-users'
          },
          // {
          //   id: 'debit_sale',
          //   title: 'Debit Note',
          //   type: 'item',
          //   url: '/v1/erp/trade'
          // },
        ]
      },
      {
        id: 'customer',
        title: 'Customer-(Trade)',
        type: 'item',
        url: '/v1/trade/customer',
        icon: 'feather icon-users'
      },
      {
        id: 'quotation',
        title: 'Quotation',
        type: 'item',
        // url: '/v1/trade/quotation',
        pri_sta: true,
        icon: 'feather icon-users'
      },
      {
        id: 'add_prod',
        title: 'Production',
        type: 'item',
        url: '/v1/manufacture/addproduct',
        icon: 'feather icon-users'
      },
      {
        id: 'transReport',
        title: 'Transaction Report',
        type: 'collapse',
        icon: 'feather icon-file',
        children: [
          {
            id: 'report1',
            title: 'Report1',
            type: 'item',
            url: '/v1/erp/manufactur'
          },
          {
            id: 'report2',
            title: 'Report2',
            type: 'item',
            url: '/v1/erp/manufactur'
          },
        ]
      },
      
      // {
      //   id: 'cashout',
      //   title: 'Cashout/Settlement',
      //   type: 'collapse',
      //   icon: 'feather icon-home',
      //   children: [
      //     {
      //       id: 'wallet1',
      //       title: 'Wallet 1',
      //       type: 'item',
      //       url: '/v1/cashout/wallet1'
      //     },
      //     {
      //       id: 'wallet2',
      //       title: 'Wallet 2',
      //       type: 'item',
      //       url: '/v1/cashout/wallet2'
      //     },
      //   ]
      // },
      // {
      //   id: 'payment',
      //   title: 'Payment',
      //   type: 'item',
      //   url: '/v1/payment',
      //   icon: 'feather icon-home'
      // },
      // {
      //   id: 'operator',
      //   title: 'Operator',
      //   type: 'item',
      //   url: '/v1/operator',
      //   icon: 'feather icon-home'
      // }

    ]
  },
  // {
  //   id: 'reports',
  //   title: 'REPORTS',
  //   type: 'group',
  //   icon: 'feather icon-layers',
  //   children: [
  //     {
  //       id: 'report1',
  //       title: 'Report 1',
  //       type: 'item',
  //       url: '/v1/',
  //       icon: 'feather icon-home'
  //     },
  //     {
  //       id: 'report2',
  //       title: 'Report 2',
  //       type: 'item',
  //       url: '/v1/',
  //       icon: 'feather icon-home'
  //     }
  //   ]
  // },
  // {
  //   id: 'settings',
  //   title: 'SETTINGS',
  //   type: 'group',
  //   icon: 'feather icon-layers',
  //   children: [
  //     {
  //       id: 'settings-page',
  //       title: 'Settings',
  //       type: 'item',
  //       url: '/v1/',
  //       classes: 'nav-item',
  //       icon: 'feather icon-sidebar'
  //     }
  //   ]
  // }

];

@Injectable()
export class NavigationItem {
  public get() {
    return NavigationItems;
  }
}
