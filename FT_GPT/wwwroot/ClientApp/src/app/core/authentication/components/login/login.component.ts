import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ilogin } from '../../interfaces/ilogin';
import { AuthenticationService } from '../../services/authentication.service';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    isPressed = false;
    userLoginSubscription?: Subscription;
    loginForm: FormGroup = new FormGroup({});
    constructor(private _fb: FormBuilder,
      private _AuthenticationService: AuthenticationService,
      private _NotificationService:NotificationService,
      private _navigation: NavigationService,
      private _notificationService:NotificationService
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm() {
        this.loginForm = this._fb.group({
            email: [null, [Validators.required]],
            password: [null, [Validators.required, Validators.minLength(8)]],
            rememberMe: [null]
        });
    }

    logIn() {
        if (this.loginForm.valid) {
            this.isPressed = true;
            const userDataRequest: Ilogin = {
                userName: this.loginForm.controls['email'].value,
                password: this.loginForm.controls['password'].value,
                rememberMe: this.loginForm.controls['rememberMe'].value ?? false
            };
            this.userLoginSubscription = this._AuthenticationService.login(userDataRequest).subscribe({
                next: (result) => {
                    this._AuthenticationService.saveUserDataToLocalStorage(result);
                    this.isPressed = false;
                    this._navigation.navigateToHomePage();
                },
                error: (error) => {
                    // this._navigation.navigateToHomePage();
                    this.isPressed = false;
                    this._notificationService.setNotification({
                        message: error?.error?.errorMessage ?? 'common.messages.error',
                        type: 'error'
                    });
                }
            });
        } else {
            this._NotificationService.setNotification({message:"error-data-not-valid", type:"error"});
        }
    }
    forgotPassword() {
    //   if(this.form.controls['email'].value){
    //     this._login.forgotPassword(this.form.controls['email'].value).subscribe({
    //       next: (result) => {
    //         this.NotificationService.setNotification({message:'forgot_password_success',type:"success"})
    //       },error:(error)=> {
    //         this.NotificationService.setNotification({message:"common.messages.error",type:"error"})
    //       }
    //     })
    //   }
    }

    ngOnDestroy(): void {
        this.userLoginSubscription?.unsubscribe();
    }

}
