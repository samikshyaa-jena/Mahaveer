import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AngularFireMessaging } from '@angular/fire/messaging'
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PushNotifyService {
    notification = new BehaviorSubject(null);

    constructor(private ngFireMessaging: AngularFireMessaging, private http: HttpClient) {
        // this.ngFireMessaging.messaging.subscribe(msgs => {
        //     msgs.onMessage = msgs.onMessage.bind(msgs);
        //     msgs.onTokenRefresh = msgs.onTokenRefresh.bind(msgs);
        // });

    }


    // requestPermission() {
    //     this.ngFireMessaging.requestToken.subscribe(
    //         (token) => {
    //             console.log('Notification Permission: ', token);

    //             const reqBody = {
    //                 token : token,
    //                 topicName : "DMT_STAGING_itpl"
    //             };

    //             this.consumeNotificationAPI(reqBody).subscribe(
    //                 (res: any) => {
    //                     // console.log('Push Notification Subscribed.');
    //                     // console.log('Push Notification Subscription Response: ', res);
    //                     this.receiveMessage();
    //                 },
    //                 (err: any) => {
    //                     console.log('Notification Subscribe Error: ', err);
    //                 }
    //             );
    //         },
    //         (err: any) => {
    //             console.log('Notification Permisssion Denied');
    //             console.log('Error: ', err);
    //         }
    //     );
    // }
     
    // receiveMessage() {
    //     this.ngFireMessaging.messages.subscribe(msg => {
    //         // console.log("Notification Message Pushed: ", msg);
    //         // console.log('Notify Subscribed Components');
    //         this.notification.next(msg);
    //     })
    // }

    // consumeNotificationAPI(reqBody) {
    //     return this.http.post('https://subscribeandunsubscribetoken-vn3k2k7q7q-uc.a.run.app/subscribetotopic', reqBody);
    // }

}