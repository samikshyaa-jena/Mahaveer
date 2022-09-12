import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { finalize, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import * as vex from 'vex-js';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CountdownComponent } from "ngx-countdown";

import { PushNotifyService } from "src/app/push-notify.service";
import { Socket2Service } from "src/app/socket2.service";
import { FundtransferService } from "../fundtransfer.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AppService } from "src/app/app.service";

@Component({
    selector: 'app-fundtransfer',
    templateUrl: './fundtransfer.component.html',
    styleUrls: ['./fundtransfer.component.scss'],
    providers: [CurrencyPipe]
})
export class FundtransferComponent implements OnInit, OnDestroy {

    // Customer Properties
    customer = {
        flags: { verified: false, added: false, checked: false, startTimer: false },
        data: <any>{},
        valid: false,
        benes: [],
        limit: 0,
        resend: { count: 0, allow: true },
    };
    customerform: FormGroup;
    otpForm: FormGroup;

    // Beneficiary Properties
    beneficiary = {
        flags: { added: false, verified: false, update: false },
        showBenes: false,
        selectedBene: <any>{},
        bankDetails: <any>{},
        banks: <any>[],
        valid: false
    };
    beneform: FormGroup;

    // Transfer Properties
    transfer = {
        amount: 0,
        showAmountForm: true,
        transMode: 'IMPS',
        valid: false
    };
    amountform: FormGroup;

    transferData = {
        customerData: { name: '', mobileNumber: '', id: null },
        beneData: { name: '', bankName: '', accountNumber: '', ifscCode: '', id: null },
        date: new Date(),
        amount: 0,
        mode: 'IMPS'
    };

    // General Properties
    transferView = false;
    transferErr = false;
    connectNTrans = { data: undefined, type: true }; // true => Money Transfer, false => Bene Verification
    loader = { general: false, transfer: false };
    unsub = new Subject();
    @ViewChild('modalSuccess', { static: false }) public transModal: any;
    @ViewChild('confirmMessage', { static: false }) public confirmModal: any;
    @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

    socketData = {
        socket_timeout: false,
    
        amount: 1,
        bene_acc: "487893458948",
        bene_bank: "AXIS BANK",
        bene_ifsc: "UTIB0000004",
        bene_name: "Mahesh",
        created_date: "2021-02-19 11:46:48",
        customer_mobile: "8595138338",
        customer_name: "Prabin Sarab",
        id: 820611392503824,
        operation_performed: "FN_FUND_TRANSFER",
        rrn: [{rrn: "1030102930238", amount: 201}, {rrn: "1030102930238", amount: 201}],
        shop_name: "N/A",
        status: "FAILED",
        status_desc: "Call back commit",
        trans_mode: "IMPS",
        update_date: "2021-02-19 11:46:48",
        total_available_amount: 0
    };

    constructor(
        private fundTransferService: FundtransferService,
        private pushnotifyService: PushNotifyService,
        private socketService2: Socket2Service,
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
        private ngxSpinner: NgxSpinnerService,
        private appService: AppService
    ) { (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs; }

    ngOnInit() {

        this.customerInitialization();
        this.beneInitialization();
        this.transferInitialization();

        this.observeSocketConn();
        this.observeNotification();
    }

    observeNotification() {
        this.pushnotifyService.notification
        .pipe(takeUntil(this.unsub))
        .subscribe(msg => {
          // console.log('Notification Message in DMT: ', msg);
          // console.log('Transfer Ended: ', new Date());
        });
    }
    
    observeSocketConn() {
        this.socketService2.socketConnected
        .pipe(takeUntil(this.unsub))
        .subscribe(socket => {

            if ((socket.type !== 'INIT')) { // Don't listen to initial socket data.
                if (socket.status) {
                    console.log('Socket Connected Listened');

                    console.log('Connect N Trans Data: ', this.connectNTrans.data);
                    if (this.connectNTrans.data) {
                        if (this.connectNTrans.type) {
                            // Money Transfer
                            this.transferMoney(this.connectNTrans.data);
                        } else {
                            // Bene Verification
                            this.verifyBene(this.connectNTrans.data);
                        }
                    } else {
                        this.socketService2.disconnectSocket();
                    }

                  if (this.transferErr) { // If transError, disconnect the socket.
                    this.socketService2.disconnectSocket();
                  }

                } else {

                    console.log('Socket Disconnected Listened');

                    this.loader.general = false;
                    this.transferErr = false; // Reset transError to allow socket connection again.
                    
                }
            }

        });
    }

    connectSocket() {
        this.socketService2.setupSocket();
    
        const socketSub = this.socketService2.socketData
        .pipe(takeUntil(this.unsub))
        .subscribe((data: any) => {
          console.log('Socket Data In DMT: ', data);
          if (data) {
            // this.socketData = {...data, rrn: []};
            this.socketData = data;
    
            // Socket Gets Timeout Handled
            if (data.socket_timeout) {
    
                // vex.dialog.alert('Socket Timeout');
                this.showTransModal(this.socketData.status);
    
            } else {
    
              // Beneficiary Verification Performed Code Starts
              if (this.socketData.operation_performed === 'FN_BENE_VERIFICATION') {
                // this.socketData.bene_name = 'Akshaya';
                
                // this.beneficiary.selectedBene = {
                //     ...this.beneficiary.selectedBene,
                //     name: this.socketData.bene_name,
                //     accountNumber: this.socketData.bene_acc,
                //     ifscCode: this.socketData.bene_ifsc,
                //     bankName: this.socketData.bene_bank
                // };

                this.beneform.patchValue({
                    name: this.socketData.bene_name,
                    accountNumber: this.socketData.bene_acc,
                    ifscCode: this.socketData.bene_ifsc,
                    bankName: this.socketData.bene_bank
                });
                
                // this.socketData.status = 'FAILED';
                if (this.socketData.status === 'FAILED') { 
                    this.beneficiary.flags.verified = false; 
                }
                if (this.socketData.status === 'SUCCESS') { 
                  this.beneficiary.flags.verified = true; 

                  // Case of Bene added then verified
                  console.log('Bene Added after verify: ', this.beneficiary.flags.added);
                  console.log('Selected Bene after verify: ', this.beneficiary.selectedBene);
                  if ( this.beneficiary.flags.added && this.beneficiary.selectedBene ) { 
                    // this.beneficiary.flags.disable = true; // Make the beneform disable 
                    this.beneform.disable();
                    this.beneficiary.flags.update = true; 
                    this.beneficiary.flags.added = true; 
                  }

                }
                // console.log('Match Details Selected Bene: ', this.selectedBene);
                // console.log('Bene Flags in Verification: ', this.beneFlags);
              } else {
                
                // Fetch RRN Details
                this.getRRN(data.id);
                // Fetch Shop Name
                this.getShopName();

                // this.appService.fetchWalletBalance();
              }
              // Beneficiary Verification Performed Code Ends

              // Update Total Amount of Customer
              this.customer.limit = this.socketData.total_available_amount;
    
              this.showTransModal(this.socketData.status); // Show the Socket Data in the Modal.
              this.socketService2.socketData.next(null); // Clear the socketData once received.
    
            }
    
            socketSub.unsubscribe(); // Unsubscribe socketData to prevent multiple emissions.
            this.socketService2.disconnectSocket(); // Disconnect Socket
    
          }
        });
      }

    customerInitialization() {
        this.customerform = new FormGroup({
            mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[6-9][0-9]{9}$/)]),
            name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)])
        });

        this.otpForm = new FormGroup({
            digit1: new FormControl('', Validators.required),
            digit2: new FormControl('', Validators.required),
            digit3: new FormControl('', Validators.required),
            digit4: new FormControl('', Validators.required),
            digit5: new FormControl('', Validators.required),
            digit6: new FormControl('', Validators.required),
        });

        this.observeMobileNumber();
    }

    beneInitialization() {
        this.beneform = new FormGroup({
            bankName: new FormControl('', [Validators.required]),
            accountNumber: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(18), Validators.pattern(/^[0-9]+$/)]),
            ifscCode: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]),
            name: new FormControl('', null),
            mobileNumber: new FormControl('', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[6-9][0-9]{9}$/)]),
        });

        this.observeBene();
    }

    transferInitialization() {
        this.amountform = new FormGroup({
            transactionAmount: new FormControl('', [Validators.required, Validators.min(100)])
        });

        this.observeAmount();
    }

    // CUSTOMER SECTION STARTS

    // Check Customer
    observeMobileNumber() {
        this.customerform.get('mobileNumber').valueChanges
        .pipe(takeUntil(this.unsub))
        .subscribe(
            val => {
                
                if (this.customerform.get('mobileNumber').valid) {
                    
                    this.loader.general = true;
                    this.fundTransferService.getCustomer({mobileNumber: val})
                    .pipe(finalize(() => { 
                        this.customer.flags.checked = true; // Customer Availability Checked.
                        this.resetForm(); // Reset Bene Data
                        this.transfer.showAmountForm = true; // Transfer Select State
                        this.loader.general = false;
                    })).subscribe(
                        (res: any) => {
                            console.log('Customer Checked Res: ', res);

                            // Customer State
                            this.customer.data = res; // Keep all the Customer Data
                            this.customerform.patchValue({ name: this.customer.data.name }); // Populate the Customer Name
                            this.customer.flags.added = true; // Customer is registered.
                            this.customer.benes = this.customer.data.benes; // Customer's Bene List
                            this.customer.limit = this.customer.data.customerLimit.totalLimit; // Set the Customer Limit

                            // Beneficiary State
                            this.beneficiary.selectedBene = null;
                            
                            // Set According to Customer Verification
                            if (this.customer.data.status === '2') {
                                this.customer.flags.verified = true;
                                this.transferView = true;
                                this.customer.valid = true;

                                // Quick Transfer Data
                                this.transferData.customerData.mobileNumber = this.customer.data.mobileNumber;
                                this.transferData.customerData.name = this.customer.data.name;
                                this.transferData.customerData.id = this.customer.data.id;
                            } else {
                                this.customer.flags.verified = false;
                                this.transferView = false;
                                this.customer.valid = false;
                            }

                        },
                        (err: any) => {
                            console.log('Customer Checked Error: ', err);

                            this.customerform.patchValue({ name: '' }); // Empty the Customer Name
                            this.transferView = false; // Hide the Transfer View
                            this.customer.flags.added = false; // Customer is not registered.
                            this.customer.flags.verified = false; // Customer is not verified.
                            this.customer.benes = []; // Empty the Bene List
                            this.customer.valid = false; // Customer not valid
                            this.customer.limit = 0; // Reset the Customer Limit

                            // Quick Transfer Data
                            this.transferData.customerData.mobileNumber = this.transferData.customerData.name = this.transferData.customerData.id = '';

                            if(err.status === 400) {
                                vex.dialog.alert(err.error.statusDesc);
                            } else {
                                vex.dialog.alert(`Server Error`);
                            }
                        }
                    );

                } else {

                    this.transferView = false; //Hide the Transfer View
                    this.amountform.reset(); // Reset amount
                    // Reset the Customer Data.
                    this.customer = {
                        flags: { verified: false, added: false, checked: false, startTimer: false },
                        data: <any>{},
                        valid: false,
                        benes: [],
                        limit: 0,
                        resend: { count: 0, allow: true },
                    };

                    // Reset the Customer Data.
                    this.transfer = {
                        amount: 0,
                        showAmountForm: true,
                        transMode: 'IMPS',
                        valid: false
                    };
                }
            }
        );
    }

    // Register Customer
    regCustomer() {
        if (this.customerform.valid) {

            console.log('Reg Customer in Sender: ', this.customerform.value);
            this.loader.general = true;
            this.fundTransferService.addCustomer(this.customerform.value)
            .pipe(finalize(() => { 
                this.loader.general = false;
            }))
            .subscribe(
                (res: any) => {
                    console.log('Add Customer Res: ', res);

                    this.customer.flags.added = true; // Customer registered
                    // Start the Timer.
                    this.customer.flags.startTimer = true; 
                    // As the countdown is totally controllable in html, hence timeout
                    setTimeout(() => {
                        this.countdown.restart();
                        this.countdown.begin();
                    }, 100);

                },
                (err: any) => {
                    this.customer.flags.added = false; // Customer not registered
                    if (err.status === 400) {
                        vex.dialog.alert(err.error.statusDesc);
                    } else {
                        vex.dialog.alert('Server Error');
                    }
                }
            );

        } else {
            vex.dialog.alert('Please, fill up al the details.');
        }
    }

    // Autofocus next valid OTP Input
    otpClick(e, prevBox, nextBox) {
        if (nextBox && e.data) { nextBox.focus(); }
        if (prevBox && !e.data) { prevBox.focus(); }
    }

    // Handle Countdown Timer
    handleEvent(cdEvent: any) {
        if (cdEvent.action === 'done') { 
            this.customer.flags.startTimer = false;
        }
        // if (['restart', 'start'].includes(cdEvent.action)) { this.senderFormData.activateResend = true; this.senderFormData.showTimer = true; }
    }

    // Verify OTP
    verifyOTP() {
        if (this.customerform.valid && this.otpForm.valid) { 

            const otp = Object.values(this.otpForm.value).join('');
            const { mobileNumber } = this.customerform.value;
            const otpData = { mobileNumber, otp };

            console.log('OTP Data: ', otpData);

            this.loader.general = true;
            this.fundTransferService.verifyOTP({ mobileNumber, otp })
            .pipe(finalize(() => { 
                this.otpForm.reset();
                this.loader.general = false;
                this.customer.flags.startTimer = false;
            }))
            .subscribe(
              (res: any) => {
                console.log('OTP Verification Res: ', res);
                vex.dialog.alert(res.statusCode);

                this.customer.flags.verified = true;
                this.customer.data = res; // Keep all the Customer Data
                this.customer.benes = this.customer.data.benes; // Customer's Bene List
                this.customer.limit = this.customer.data.customerLimit.totalLimit; // Set the Customer Limit
                this.customer.valid = true; // Make the Customer valid.
                this.transferView = true;

                // Quick Transfer Data
                this.transferData.customerData.mobileNumber = this.customer.data.mobileNumber;
                this.transferData.customerData.name = this.customer.data.name;
                this.transferData.customerData.id = this.customer.data.id;
          
              },
              (err: any) => {
                console.log('OTP Verification Error: ', err);
    
                this.customer.flags.verified = false;
                this.customer.data = <any>{};
                this.customer.benes = []; // Empty Customer's Bene List
                this.customer.limit = 0; // Reset the Customer Limit
                this.customer.valid = false; // Make the Customer invalid.
                this.transferView = false;

                // Quick Transfer Data
                this.transferData.customerData.mobileNumber = this.transferData.customerData.name = this.transferData.customerData.id = '';
    
                if (err.status === 400) {
                    vex.dialog.alert({
                        unsafeMessage: `
                            <div class="d-flex flex-column">
                                <b>OTP Verification Failed.</b>
                                <small>${err.error.statusDesc}</<small>
                            </div>
                        `
                    });
                } else {
                    vex.dialog.alert('Server Error');
                }
      
              }
            );

        } else {
            vex.dialog.alert('Please, fill up all the details.');
        }
    }

    // Resend OTP
    resendOTP() {
        if (this.customerform.valid && !this.customer.flags.startTimer && !this.customer.flags.verified && this.customer.flags.added && this.customer.resend.allow) {

            const { mobileNumber } = this.customerform.value;

            console.log('OTP Verify Data: ', { mobileNumber });

            this.loader.general = true;
            this.fundTransferService.resendOTP({ mobileNumber })
            .pipe(finalize(() => { 
                this.otpForm.reset();
                this.loader.general = false;
            }))
            .subscribe(
                (res: any) => {
                    console.log('OTP Resending Res: ', res);
                    vex.dialog.alert(res.statusDesc);
    
                    this.customer.resend.count++;
                    this.customer.flags.startTimer = true;
                    setTimeout(() => {
                        this.countdown.restart();
                        this.countdown.begin();
                    }, 100);
    
                    // Don't allow to resend OTP after 5 times
                    if (this.customer.resend.count >= 5) {
                        this.customer.resend.allow = false;
                    }
                },
                (err: any) => {
                    console.log('OTP Resending Error: ', err);
    
                    if (err.status === 400) {
                        vex.dialog.alert({
                            unsafeMessage: `
                                <div class="d-flex flex-column">
                                    <b>OTP Resending Failed.</b>
                                    <small>${err.error.statusDesc}</<small>
                                </div>
                            `
                        });
                    } else {
                        vex.dialog.alert('Server Error');
                    }
                }
            );

        } else {
            if (!this.customer.resend.allow) {
                vex.dialog.alert('You have exceeded OTP resending limit.');
                return;
            }

            if (this.customerform.invalid) {
                vex.dialog.alert('Please, fill up valid details.');
                return;
            }
            if (!this.customer.flags.added) {
                vex.dialog.alert('Please, register customer before resending OTP.');
                return;
            }
            if (this.customer.flags.verified) {
                vex.dialog.alert('Customer is already verified.');
                return;
            }
        }
    }

    // CUSTOMER SECTION ENDS

    // BENEFICIARY SECTION STARTS

    // Validate Bene
    observeBene() {
        this.beneform.valueChanges.pipe(takeUntil(this.unsub)).subscribe(val => {
            if (this.beneficiary.selectedBene) { // If Bene is already selected and customer edit the values
              const selBene = Object.values(this.beneficiary.selectedBene); // Get Selected Bene Values
              const beneVal = Object.values(this.beneform.value); // Get Bene Form Values
            
              // If any of the form field value does not match with the selected bene values
              if (beneVal.some((value) => !selBene.includes(value))) {
                this.beneficiary.flags.added = false;
                this.beneficiary.flags.verified = false;
                this.beneficiary.flags.update = false;
                this.beneficiary.valid = false;
                this.transfer.showAmountForm = true;
              }
            }
          });
    }

    // Search Beneficiary from the Bene List
    filterBene(e: any) {      
        this.beneficiary.showBenes = true;
        this.customer.benes = this.customer.data.benes.filter(bene => bene.name.toLowerCase().includes(e.target.value.toLowerCase()));
    }

    searchBank(e, checkDmt = false) {
        const query = {
            "size": 1000,
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "dmt": {
                                    "query": true
                                }
                            }
                        }
                    ],
                    "filter": {
                        "multi_match": {
                            "query": checkDmt ? e : e.target.value,
                            "type": "phrase_prefix",
                            "fields": [
                                "bank_code",
                                "bank_name"
                            ],
                            "lenient": true
                        }
                    }
                }
            }
        };
        this.fundTransferService.searchBank(query)
        .pipe(finalize(() => {
            this.ngxSpinner.hide('elasticSpinner');
        }))
        .subscribe(
            (res: any) => {
                this.beneficiary.banks = res.hits.hits.map(hit => { 
                    return { 
                        bankName: hit._source.bank_name, 
                        ifsc: hit._source.ifsc_code, 
                        bankCode: hit._source.bank_code, 
                        dmtEnabled: hit._source.dmt_enable 
                    }
                });
                if (checkDmt) {
                    console.log('Bene Banks: ', this.beneficiary.banks);
                    console.log('Selected in Form: ', e);
                    this.beneficiary.bankDetails = this.beneficiary.banks.find(bank => ((bank.bankName === e) || (bank.bankCode === e)));
                    console.log('Bank Details: ', this.beneficiary.bankDetails);
                }
            },
            (err: any) => {
                console.log('Bank Error: ', err);
            }
        );
    }

    setIfsc(bank: {bankName: string, ifsc: string, bankCode: string, dmtEnabled: boolean}) {
        console.log('Seelcted Bank: ', bank);
        this.beneficiary.bankDetails = bank;
        this.beneform.patchValue({ifscCode: bank.ifsc});
        this.beneform.get('ifscCode').markAsTouched();
    }

    populateBene(bene: any) {
        console.log('Selected Bene in Recipient: ', bene);

        this.beneficiary.showBenes = false;
        this.beneficiary.selectedBene = bene;
        this.beneform.patchValue(bene);
        this.beneform.get('bankName').markAsTouched();
        this.beneficiary.flags.added = true;
        this.beneficiary.flags.verified = (bene.status === '0') ? false : true;
        this.beneficiary.valid = true;

        this.transfer.showAmountForm = true; // Show the amount form

        // Set Quick Transfer Bene Data
        this.transferData.beneData.accountNumber = this.beneficiary.selectedBene.accountNumber;
        this.transferData.beneData.bankName = this.beneficiary.selectedBene.bankName;
        this.transferData.beneData.ifscCode = this.beneficiary.selectedBene.ifscCode;
        this.transferData.beneData.name = this.beneficiary.selectedBene.name;
        this.transferData.beneData.id = this.beneficiary.selectedBene.id;
    
        this.ngxSpinner.show("elasticSpinner", { bdColor: "rgba(0, 0, 0, 0.5)", type: "timer" });
        this.searchBank(this.beneficiary.selectedBene.bankName, true); // Fetch the bank details
    
    }

    resetForm() {
        this.beneform.reset();
        this.transfer.showAmountForm = true;
        this.beneficiary.showBenes = false;
        this.beneficiary.flags = { added: false, verified: false, update: false };
        this.beneficiary.bankDetails = null;
        this.beneficiary.selectedBene = null;
        this.beneficiary.valid = false;
        this.beneform.get('bankName').markAsUntouched();
    }

    // Add Beneficiary
    addBene() {
        if (!this.beneform.get('name').value.trim() || !this.beneform.get('bankName').value.trim()) {
            vex.dialog.alert('Empty values not allowed.');
            return;
        }

        if (this.beneform.valid) {

            const beneData = {
                ...this.beneform.value, 
                status: this.beneficiary.flags.verified ? "1" : "0",
                bankName: this.beneficiary.bankDetails ? (this.beneficiary.bankDetails.bankCode ? this.beneficiary.bankDetails.bankCode : this.beneficiary.bankDetails.bankName) : this.beneform.value.bankName,
                customerMobileNumber: this.customer.data.mobileNumber
            };

            console.log('Bene Data: ', beneData);

            this.loader.general = true;
            this.fundTransferService.addBeneficiary(beneData)
            .pipe(finalize(() => { 
                this.loader.general = false;
            }))
            .subscribe(
                (res: any) => {
                    console.log('Bene Add Response: ', res);

                    vex.dialog.alert('Beneficiary Added Successfully.');
                    
                    this.beneficiary.selectedBene = res;
                    this.customer.data.benes.push(res);
                    this.customer.benes = this.customer.data.benes; // Reset the list for better UI
                    this.beneficiary.showBenes = false; // Hide Bene list as adding new element in the array will show the list.
                    this.beneficiary.flags.added = true;
                    this.beneficiary.valid = true;

                    // Set Quick Transfer Bene Data
                    this.transferData.beneData.accountNumber = this.beneficiary.selectedBene.accountNumber;
                    this.transferData.beneData.bankName = this.beneficiary.selectedBene.bankName;
                    this.transferData.beneData.ifscCode = this.beneficiary.selectedBene.ifscCode;
                    this.transferData.beneData.name = this.beneficiary.selectedBene.name;
                    this.transferData.beneData.id = this.beneficiary.selectedBene.id;

                },
                (err: any) => {
                    console.log('Bene Add Error: ', err);

                    this.beneficiary.flags.added = false;
                    this.beneficiary.selectedBene = null;
                    this.beneficiary.valid = false;
                    if (err.status === 400) {
                        vex.dialog.alert(err.error.statusDesc);
                    } else {
                        vex.dialog.alert('Server Error.');
                    }
                }
            );

        } else {
            vex.dialog.alert('Please fill up valid details.');
        }

    }

    // Delete Beneficiary
    deleteBene() {
        console.log('Bene Deletion.');

        if (this.beneficiary.selectedBene) {

            const { id } = this.beneficiary.selectedBene;

            this.loader.general = true;
            this.fundTransferService.changeBeneStaus({ id })
            .pipe(finalize(() => { 
                this.loader.general = false;
            }))
            .subscribe(
                (res: any) => {
                    console.log('Bene Deleted Res: ', res);

                    vex.dialog.alert('Beneficiary Deleted Successfully!');

                    this.customer.benes = this.customer.data.benes = this.customer.data.benes.filter(bene => bene.id !== id);
                    this.beneficiary.selectedBene = undefined;
                    this.beneficiary.valid = false;
                    this.beneform.reset();
                    // Make all the fields false
                    this.beneficiary.flags.added = false;
                    this.beneficiary.flags.update = false;
                    this.beneficiary.flags.verified = false;

                    this.transfer.showAmountForm = true; // Show the amount form

                    // Reset Bene Data in Quick Transfer
                    this.transferData.beneData = { name: '', bankName: '', accountNumber: '', ifscCode: '', id: null };
                    // Enable the Bene form, if/not disabled
                    // if (this.beneData.flags.disable) { this.beneData.flags.disable = false; }

                    console.log('Quick Transfer Data: ', this.transferData);
                    
                },
                (err: any) => {
                    console.log('Bene Deleted Error: ', err);

                    this.beneficiary.flags.added = true;
                    if (err.status === 400) {
                        vex.dialog.alert(err.error.statusDesc);
                    } else {
                        vex.dialog.alert('Server Error.');
                    }
                }
            );

        } else {
            vex.dialog.alert('Please, select a beneficiary.');
        }

    }

    // Connect Socket And Verify
    connectThenVerify() {
        if (this.beneform.valid) {
            console.log('Bene Verification.');

            this.loader.general = true;
            this.connectNTrans.data = {...this.beneform.value, customerMobileNumber: this.transferData.customerData.mobileNumber, isSL: false};
            this.connectNTrans.type = false; // Bene Verification flag.

            this.connectSocket();


        } else {
            vex.dialog.alert('Please fill up valid details.');
        }
    }

    // Verify Beneficiary
    private verifyBene(beneData: any) {

        this.fundTransferService.verifyBene(beneData)
        .pipe(finalize(() => { 
            // Empty the data for validating bene verification.(For Safe Side)
            // Otherwise, everytime socket gets connected, this function will be called.
            this.connectNTrans.data = undefined; 
         }))
        .subscribe(
            (res: any) => {
                console.log('Verify Bene Response: ', res);
                this.transferErr = false; // Reset transError to allow socket connection again.
                // vex.dialog.alert(res.statusDesc);
            },
            (err: any) => {

                this.loader.general = false;
                this.transferErr = true;
                console.log('Socket Check in Bene Verification Error: ', this.socketService2.isConnected);
                if (this.socketService2.isConnected) { this.socketService2.disconnectSocket(); }
                if (err.status === 400) {
                    vex.dialog.alert(err.error.statusDesc);
                } else {
                    vex.dialog.alert('Server Error.');
                }
            }
        );

    }

    addOrUpdate() {
        this.transModal.hide();

        if (this.beneficiary.flags.verified) {
            if (this.beneficiary.flags.update) {
                this.updateBene();
            } else {
                this.addBene();
            }
        }
    }

    updateBene() {
        if (this.beneficiary.flags.update) {
            console.log('Update Beneficiary.');

            const beneData = { ...this.beneform.getRawValue(), id: this.beneficiary.selectedBene.id, status: "1" };

            // const updatedData = { ...beneData, id: this.beneData.selectedBene.id, status: "1" };

            this.loader.general = true;
            this.fundTransferService.updateBene(beneData)
            .pipe(finalize(() => {
                this.loader.general = false; 
            }))
            .subscribe(
              (res: any) => {
                console.log('Update Bene Response: ', res);
                vex.dialog.alert('Bene Updated Successfully!!');
                this.beneficiary.flags.update = false;
                this.beneficiary.selectedBene = res;
                if (this.beneform.disabled) { this.beneform.enable(); }
        
                // Update Bene List After Successfull Bene Updation
                const beneIndex = this.customer.data.benes.findIndex(bene => bene.id === this.beneficiary.selectedBene.id);
                this.customer.data.benes[beneIndex] = this.beneficiary.selectedBene;
                this.customer.benes = this.customer.data.benes; // Reset the list for better UI
        
              },
              (err: any) => {
                console.log('Update Bene Error: ', err);
                if (err.status === 400) {
                  vex.dialog.alert(err.error.statusDesc);
                } else {
                  vex.dialog.alert('Server Error.');
                }
              }
            );

        } else {
            vex.dialog.alert('Beneficiary cannot be updated.');
        }
    }
    // BENEFICIARY SECTION ENDS

    // TRANSFER SECTIONS STARTS

    // Validate Amount
    observeAmount() {
        this.amountform.get('transactionAmount').valueChanges
        .pipe(takeUntil(this.unsub))
        .subscribe(
            val => {
                if ((+val) > this.customer.limit) {
                    this.amountform.patchValue({
                        transactionAmount: (val.slice(0, -1))
                    });
                }
            }
        );
    }

    updateTransMode(mode = 'IMPS') {
        this.transferData.mode = this.transfer.transMode = mode;
    }

    pay() {

        if (!this.beneficiary.valid) {
            vex.dialog.alert('Please, add/select a beneficiary.');
            return;
        }

        if (this.amountform.valid) {
            this.transferData.amount = this.amountform.value.transactionAmount;
            this.transfer.showAmountForm = !this.transfer.showAmountForm;
            this.transfer.valid = true;
        } else {
            vex.dialog.alert('Please enter the amount.');
            this.transfer.valid = false;
        }
    }

    // Case 1: Normal Transaction (if bank is available for DMT Transaction) ---> direct = false
    // Case 2: Retry Transaction (if bank is unavailable for DMT Transaction) ---> direct = true
    connectThenTransfer(direct = false) {
        console.log('Quick Transfer Data: ', this.transferData)
        if (this.amountform.valid) {

            if (this.customer.valid && this.beneficiary.valid && this.transfer.valid) {
        
                const transferData = {
                  transactionMode: this.transferData.mode,
                  isSl: false,
                  customerId: this.transferData.customerData.id,
                  beneId: this.transferData.beneData.id,
                  amount: this.transferData.amount,
                  isHoldTransaction: this.beneficiary.bankDetails ? ((this.beneficiary.bankDetails.dmtEnabled === false) ? true : false) : false
                };
            
                console.log('Money Transfer Data: ', transferData);

                
                if (!this.beneficiary.bankDetails || (this.beneficiary.bankDetails.dmtEnabled !== false)) { 

                    this.loader.general = true; // Start Laoder
                    this.connectNTrans.data = transferData;
                    this.connectNTrans.type = true; // Money Transfer flag.

                    this.connectSocket(); 

                } else {

                    if (direct) {
                        this.loader.general = true; // Start Laoder
                        this.transferMoney(transferData);
                    } else {
                        this.confirmModal.show();
                    }
                }
            
    
            } else {
                vex.dialog.alert('Please, check transfer details before proceeding.');
            }
            
        } else {
            vex.dialog.alert('Please enter the amount before proceeding.');
        }

    }

    private transferMoney(transData: any) {

        this.fundTransferService.transferMoney(transData)
        .pipe(finalize(() => { 
            if (this.beneficiary.bankDetails && (this.beneficiary.bankDetails.dmtEnabled === false)) { this.loader.general = false; }
            this.connectNTrans.data = undefined;
            this.transfer.showAmountForm = true;
        }))
        .subscribe(
          (res: any) => {
            console.log('Transfer Money Response: ', res);
            this.amountform.reset();
            this.transferErr = false; // Reset transError to allow socket connection again.
            if (this.beneficiary.bankDetails && (this.beneficiary.bankDetails.dmtEnabled === false)) {
                vex.dialog.alert(`Message: ${res.statusDesc} with Transaction ID: ${res.txnId}`);
            }
            // vex.dialog.alert('Transaction is in progress.');
          },
          (err: any) => {
                console.log('Transfer Money Error: ', err);

                this.transferErr = true;
                this.loader.general = false;
                if (this.socketService2.isConnected) { this.socketService2.disconnectSocket(); }
                if (err.status === 400) {
                    vex.dialog.alert(err.error.statusDesc);
                } else {
                    vex.dialog.alert('Server Error.');
                }
          }
        );

    }
    // TRANSFER SECTIONS ENDS

    // OTHER SECTION STARTS

    // MODAL SHOW CODE
    showTransModal(status = 'SUCCESS') {
        console.log('Trans Status: ', this.socketData.status);
        this.socketData.status = status;
        this.transModal.show();
    }

    // Get RRN of a Transaction
    getRRN(txnID: string) {
        console.log('RRN Data Fetched: ', new Date());
        this.fundTransferService.fetchRRN(txnID)
        // this.fundTransferService.fetchRRN("823438505072926720")
        .subscribe(
            (res: any) => {
                console.log('Fetch RRN Response: ', res);

                this.socketData.rrn = res.map(data => { return { rrn: (data.rrn ? data.rrn : 'N/A'), amount: data.amount } });
                console.log('RRN Data: ', [['RRN', 'Amount'], ...this.socketData.rrn.map(data => { const values = Object.values(data); return [values[0], this.currencyPipe.transform(values[1], 'INR')]; })]);
            },
            (err: any) => {
                console.log('Fetch RRN Error: ', err);
                if (err.status === 400) {
                    vex.dialog.alert(err.error.statusDesc);
                } else {
                    vex.dialog.alert('Server Error.');
                }
            }
        );
    }

    // Get Shop Name of an User
    getShopName() {

        this.fundTransferService.fetchShopName2()
        .subscribe(
            (res: any) => {
                console.log('Shop Name in FT2 Res: ', res);

                this.socketData.shop_name = res.shopName;
            },
            (err: any) => {
                console.log('Shop Name in FT2 Error: ', err);
                if (err.status === 400) {
                    // this.socketData.shop_name = err.error.shopName;
                    // vex.dialog.alert(err.error.statusDesc);
                } else {
                    vex.dialog.alert('Server Error.');
                }
            }
        );
    }

    generatePDF(action = 'open') {    
    
        let docDefinition = {
          pageSize: 'A4',
          pageMargins:[ 0, 0, 0, 0 ],
        content: [
            {
            style: 'tableExample',
                fillColor: '#f5f9f9',
            table: {
              widths: [595],
            body: [
                  [
                      [
                          {
                                style: 'tableExample',
                                margin: [40, 50, 50, 20],
                                table: {
                                    widths: [250, 250],
                                  body: [
                                      [
                                          {
                                              text: 'iServeU',
                                              style: 'tableHeader',
                                              margin: [0, 0, 0, 25]
                                          },
                                          {
                                              text: this.datePipe.transform(this.socketData.created_date, 'medium'),
                                              alignment: 'right',
                                              margin: [0, 0, 0, 25]
                                          }
                                      ],
                                      [
                                          {
                                              table: {
                                                  widths: [200],
                                                  body: [
                                                    [
                                                        {
                                                            text: 'From',
                                                              color: '#888888',
                                                              margin: [0, 0, 0, 5],
                                                              border: [false, false, false, true]
                                                        }
                                                    ]
                                                    ]
                                                },
                                                margin: [0, 0, 0, 10],
                                                layout: {
                                                  hLineWidth: function (i, node) {
                                                    return (i === 0 || i === node.table.body.length) ? 1 : '';
                                                  },
                                                  hLineColor: function (i, node) {
                                                    return '#888888';
                                                  },
                                                  hLineStyle: function (i, node) {
                                                    return {dash: {length: 3, space: 3}};
                                                  },
                                                  paddingLeft: function(i, node) { return 0; }
                                                }
                                          },
                                          {
                                                table: {
                                                  widths: [200],
                                                  body: [
                                                    [
                                                        {
                                                            text: 'To',
                                                              color: '#888888',
                                                              margin: [0, 0, 0, 5],
                                                              border: [false, false, false, true]
                                                        }
                                                    ]
                                                    ]
                                                },
                                                margin: [0, 0, 0, 10],
                                                layout: {
                                                  hLineWidth: function (i, node) {
                                                    return (i === 0 || i === node.table.body.length) ? 1 : '';
                                                  },
                                                  hLineColor: function (i, node) {
                                                    return '#888888';
                                                  },
                                                  hLineStyle: function (i, node) {
                                                    return {dash: {length: 3, space: 3}};
                                                  },
                                                  paddingLeft: function(i, node) { return 0; }
                                                }
                                          }
                                      ],
                                      [
                                          {
                                              text: this.socketData.customer_name,
                                              bold: true,
                                              margin: [0, 0, 0, 4]
                                          },
                                          {
                                              text: this.socketData.bene_name,
                                              bold: true,
                                              margin: [0, 0, 0, 4]
                                          }
                                      ],
                                      [
                                          {
                                              text: 'Mob No.: '+ this.socketData.customer_mobile,
                                              color: '#555555'
                                          },
                                          {
                                              text: 'A/C No.: '+ this.socketData.bene_acc,
                                              color: '#555555'
                                          }
                                      ],
                                      [
                                          {
                                              text: ''
                                          },
                                          {
                                              text: `Bank Name: ${this.socketData.bene_bank}`,
                                              color: '#555555'
                                          }
                                      ],
                                      [
                                        {
                                            text: ''
                                        },
                                        {
                                            text: 'IFSC: ' + this.socketData.bene_ifsc,
                                            color: '#555555'
                                        }
                                    ],
                                  ],
                                },
                                layout: 'noBorders'
                              }
                      ]
                      
                  ]
              ],
            },
            layout: 'noBorders'
          },
          {
            style: 'tableExample',
                  margin: [40, 40, 0, 0],
            table: {
                widths: [510],
              body: [
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Transaction ID', this.socketData.id]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ],
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Transaction Mode', this.socketData.trans_mode]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ],
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Amount', this.currencyPipe.transform(this.socketData.amount, 'INR')]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ],
                [
                    {
                        table: {
                                widths: [250, 250],
                                body: [
                                    ['RRN', 
                                        (this.socketData.status !== 'SUCCESS') ? 'N/A' : 					
                                        {
                                            table: {
                                                widths: ['*', '*'],
                                                body: [
                                                    ['RRN', 'Amount'], 
                                                    ...this.socketData.rrn.map(data => { const values = Object.values(data); return [(values[0] ? values[0] : 'N/A'), this.currencyPipe.transform(values[1], 'INR')]; })
                                                ]
                                            },
                                        }
                                    ]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ],
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Status', this.socketData.status]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ],
                [
                    {
                        table: {
                                widths: [250, 250],
                              body: [
                                ['Shop Name', this.socketData.shop_name]
                                ]
                            },
                            layout: 'noBorders'
                    }
                ]
              ]
            },
                  layout: {
              paddingLeft: function(i, node) { return 15; }
                }
          }
        ],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 16,
            color: '#0e989a'
          }
        }
      }
       
        pdfMake.createPdf(docDefinition).open();  
      } 
    // OTHER SECTION ENDS

    ngOnDestroy() {
        this.unsub.next(true);
        this.unsub.complete();
    }
}