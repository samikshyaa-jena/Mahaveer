export class ReportsApi {
    public static url = {
        secureUrl: 'https://itpl.iserveu.tech/BQ/transactiondetails',
        recharge: {
            recharge1: 'https://itpl.iserveu.tech/BQ/transactiondetails',
            recharge2: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/new_node_bigquery_report/all_transaction_report',
        },
        dmt: {
            all_succ_trans: 'https://itpl.iserveu.tech/BQ/transactiondetails',
            refund_trans: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/new_node_bigquery_report/refund_transaction_report',
        },
        dmt2: {
            // all_trans: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/dmt_report_staging_bqdb/all_transaction_report'
            all_trans: 'https://newdmtreport-vn3k2k7q7q-uc.a.run.app/dmt_report',
            trans_detail: 'https://newdmtreport-vn3k2k7q7q-uc.a.run.app/dmt_report'
        },
        matm: {
            matm1: 'https://itpl.iserveu.tech/BQ/transactiondetails',
            matm2: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/report_matm_2',
        },
        aeps: {
            aeps1: 'https://itpl.iserveu.tech/BQ/transactiondetails',
            aeps2: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/new_node_bigquery_report/all_transaction_report',
        },
        bbps: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/new_node_bigquery_report/all_transaction_report',
        insurance: 'https://itpl.iserveu.tech/BQ/transactiondetails',

        upi: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/new_node_bigquery_report/all_transaction_report',
        unified: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/new_node_bigquery_report/all_transaction_report',
        aadhar: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/new_node_bigquery_report/all_transaction_report',

        commission: {
            comm1: 'https://itpl.iserveu.tech/BQ/transactiondetails',
            comm2: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/commission2_bigquery_report'
        },

        cashout: {
            aeps_matm: 'https://itpl.iserveu.tech/BQ/transactiondetails',
            wallet: 'https://wallet2-cashout-prod-vn3k2k7q7q-uc.a.run.app/report'
        },
        
        wallet: {
            // my_wallet1: 'https://itpl.iserveu.tech/BQ/transactiondetails',
            oldUserWallet: 'https://itpl.iserveu.tech/BQ/transactiondetails',
            userNames: 'https://itpl.iserveu.tech/getchildren/.json',
            my_wallet1: 'https://newdmtreport-vn3k2k7q7q-uc.a.run.app/dmt_report',
            my_wallet2: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/wallet_2_latest',
            wallet_intrchng: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/wallet_interchange',
        },
        shopName: 'https://itpl.iserveu.tech/usershopinfo.json',
        shopName2: 'https://wallet.iserveu.online/CORESTAGING/user/user_details',

    }
}