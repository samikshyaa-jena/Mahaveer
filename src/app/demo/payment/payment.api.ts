export class PaymentApi {
    public static url = {
        wBalData: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/isuApi/walletbalancerepay',
        // Bank Challan
        vrtlaccnt: 'https://paymentchallan.iserveu.tech/v1/getOriginbyName',
        createVrtlaccnt: 'https://paymentchallan.iserveu.tech/v1/createVa',
        // UPI payment
        fetchBankVpaList: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/isuApi/walletbalancerepay',
        payByUPI: 'https://indusindtest.iserveu.online/upi/init',
        verifyVpaAPI: 'https://indusindtest.iserveu.online/upi/validate/vpa',
        insertVpaAPI: 'https://us-central1-creditapp-29bf2.cloudfunctions.net/isuApi/walletbalancerepay/insert'
    };
}