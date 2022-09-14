import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import jwt_decode from 'jwt-decode';
import { AppService } from "../app.service";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    allowRefresh = true;
    constructor(
        private appService: AppService,
        private http: HttpClient
    ) { }
    intercept(req: HttpRequest<HttpEvent<any>>, next: HttpHandler): Observable<any> {

        // Logout when Token Expired and User tries to send request.
        if (sessionStorage.getItem('CORE_SESSION')) {
            const decToken: {exp: number} = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
            const startDate = new Date();
            const expDate = new Date(decToken.exp * 1000);
            const session = Math.ceil((<any>expDate - <any>startDate));
            const mins = Math.floor((session/1000)/60);
            
            if (expDate <= startDate) { this.appService.logOut(); }

            if (this.allowRefresh && (mins <= 10)) {
                // this.refreshToken();
            }

        } else {
            this.appService.logOut();
        }

        if (!req.url.includes('getlogintoken.json')) {
            if(req.url.endsWith('khwaja') || req.url.endsWith('shyam')) {
                req = req.clone({
                    setHeaders: {
                        "auth-token": ``
                    }
                });
            }  else {
                req = req.clone({
                    setHeaders: {
                        "auth-token": `${sessionStorage.getItem('CORE_SESSION')}`
                    }
                });
            }            
        }

        return next.handle(req);
    }

    // private async refreshToken() {
    //     this.allowRefresh = false;

    //     const encUrl = await AuthConfig.config.encodeUrl(AuthApi.url.refreshToken);

    //     this.http.post(encUrl, {})
    //     .pipe(finalize(() => { this.allowRefresh = true; }))
    //     .subscribe(
    //         (res: any) => {
    //             sessionStorage.setItem('CORE_SESSION', res.token);
    //             this.appService.autoLogOut(); 
    //         },
    //         (err: any) => {
    //         }
    //     );

    // }
}