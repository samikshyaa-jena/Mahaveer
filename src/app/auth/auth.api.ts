export class AuthApi {
    public static url = {
        // login: 'https://wallet.iserveu.online/UPITEST/getlogintoken.json',
        // dashboard: 'https://wallet.iserveu.online/UPITEST/user/dashboard.json',
        // wallet2: 'https://wallet.iserveu.online/UPITEST/wallet2/getuserbalance',
        // wallet1: 'https://wallet.iserveu.online/UPITEST/getuserbalance.json'
        // base_url : 'http://3.109.161.106:3000',
        login: 'http://3.109.161.106:3000/users/login',
        dashboard: 'https://itpl.iserveu.tech/user/dashboard.json',
        wallet2: 'https://itpl.iserveu.tech/user/wallet2/getuserbalance',
        wallet1: 'https://itpl.iserveu.tech/user/getuserbalance.json',
        refreshToken: 'https://itpl.iserveu.tech/logintokenrefresh.json'
    };
}