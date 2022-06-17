import { Injectable } from "@angular/core";
import * as io from 'src/assets/socket.io.min.js'
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class Socket3Service {
    // socket = io("https://dmtsocketstaging.iserveu.online/");
    socket: any;
    // socketData = new BehaviorSubject(null);
    socketData = new Subject();
    isConnected = false;
    socketConnected = new BehaviorSubject({type: 'INIT', status: this.isConnected});
    // timerID = [];
    timerID: any;

    constructor() {}

    user1: {sub: string} = jwt_decode(sessionStorage.getItem('CORE_SESSION'));

    setupSocket() {
        // this.disconnetSocket();
        console.log(this.user1.sub)
        this.socket = io("https://aeps3pubsubsocket.iserveu.online/");


        this.socket.on('connect', () => {
            console.log('Socket Connected');
            console.log('Socket ID: ', this.socket.id);
            console.log('Socket Connected: ', this.socket.connected);
            this.isConnected = this.socket.connected;
            this.socketConnected.next({type: 'TRANS', status: this.isConnected});
            //console.log(data);

            // const timerID = setTimeout(() => {
            // clearTimeout(this.timerID);
            // this.timerID = setTimeout(() => {
            //     this.disconnectSocket();
            //     // console.log('--------------SOCKET TIMEOUT INIT STARTS------------------');
            //     // console.log('Socket Data: ', {socket_timeout: true});
            //     // console.log('Socket Timeout: ', new Date());
            //     this.socketData.next({socket_timeout: true});
            //     // console.log('--------------SOCKET TIMEOUT INIT ENDS------------------');
            // }, 5000); // Disconnect Socket After 60s.

            console.log('Socket Timer Started.');
            this.timerID = setTimeout(() => {
                console.log('After Socket Timer Started.');
                console.log("socket timeout Before");
                this.disconnectSocket();
                // console.log('Socket Data: ', {socket_timeout: true});
                this.socketData.next({socket_timeout: true});
            }, 60000); // Disconnect Socket After 60s.
            console.log('Got Timer ID: ', this.timerID);
            console.log('Check Connection after getting Timer ID: ', this.isConnected)

            // In case when socket has been disconnected but timerID is not yet generated.
            // Then disconnect the socket.
            if (!this.isConnected) {
                this.disconnectSocket();
            }

            // this.timerID.push(timerID);
        });

        const user: {sub: string} = jwt_decode(sessionStorage.getItem('CORE_SESSION'));
        console.log(`Listening To Socket Channel: DMT_STAGING_${user.sub}`);
        this.socket.on(`${user.sub}`, (data) => {
            console.log(data);
            const formatData = JSON.parse(data);

            console.log('Socket Data: ', formatData);

            this.socketData.next({...formatData, socket_timeout: false});

        });

        this.socket.on('disconnect', (data) => {

            console.log('Socket Disconnected');
            console.log('Disconnect Socket Data: ', data);
            this.isConnected = false;
            this.socketConnected.next({type: 'TRANS', status: this.isConnected});
            console.log('Inside Disconnec Event, Timer ID: ', this.timerID);
            clearTimeout(this.timerID);
            console.log('Socket Timer Cleared.');

        });

        this.socket.on('connect_error', (err) => {
            console.log('Socket Connection Error: ', err);

            this.disconnectSocket();
        });
    }

    disconnectSocket() {
        console.log('Socket Disconnect Service Called.');
        clearTimeout(this.timerID);
        console.log('Socket Timer Cleared in disconnect method.');
        if (this.isConnected) {
            this.socket.disconnect();
        } else {
            console.log('Socket Not Connected');
        }
    }




}