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



          },
          (err: any) => {
            const errMsg = (err.error.msg) ? err.error.msg : 'Server Error, Please, try again.';
            const notify = {
              message: `Login Failed: ${errMsg}`,
              status: 'error'
            };
            this.notify(notify);
          }
        );
    
        }
      } 

