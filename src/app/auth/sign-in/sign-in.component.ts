import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "../auth.service";
import { AuthApi } from '../auth.api';
import { Router } from "@angular/router";

import Toastify from 'toastify-js'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  // userImg = 'https://firebasestorage.googleapis.com/v0/b/iserveu_storage/o/AdminFolder%2FinHouse%2Fphoto.png?alt=media&token=b0198a05-5988-4469-bdce-d52afb30ff19';
  signInForm: FormGroup;
  signing = false;
  siteData = {};

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.signInForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  notify(options: { message: string, status: string }) {
    Toastify({
      text: options.message,
      duration: 5000,
      className: (options.status === 'success') ? 'toastr-base toastr-success' : 'toastr-base toastr-error',
      close: true
    }).showToast();
  }

  loginUser() {
    let reqbody={
      "email": this.signInForm.get('username').value,
      "password": this.signInForm.get('password').value
    }
    this.authService.signUser(AuthApi.url.login, reqbody).subscribe(
        
          (res: any) => {
           if (res.token) {
            const 
            notify = {
              message: 'Login Successfull',
              status: 'success'
            };
            this.notify(notify);

            sessionStorage.setItem('CORE_SESSION', res.token);
            this.router.navigate(['/v1']);
           } else {
            const notify = {
              message: `Login Failed: ${res.msg}`,
              status: 'error'
            };
            this.notify(notify);
          }

            // this.store.dispatch(new Dashboard.SetUserData({ loggedInUser: this.signInForm.value.username }));

            // this.fetchDashboardData();
            // this.fetchWallet1();
            // this.fetchWallet2();

            // this.appService.observeInternetConn(); // Observe Internet Connection
            // this.appService.autoLogOut();


          },
          (err: any) => {
            const errMsg = (err.error.message) ? err.error.message : 'Server Error, Please, try again.';
            const notify = {
              message: `Login Failed: ${errMsg}`,
              status: 'error'
            };
            this.notify(notify);
          }
        );
    
        }
      }

//  

