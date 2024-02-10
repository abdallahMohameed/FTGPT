import { Injectable, Injector } from '@angular/core';
import { baseHttp } from '../../services/baseHttp.service';
import { Observable } from 'rxjs';
import { Ilogin } from '../interfaces/ilogin';
import { ILoginResponse } from 'src/app/shared/interfaces/ResInterfaces/ILoginResponse';
import { IHttpResponse } from 'src/app/shared/interfaces/IHttpResponse';
import { NotificationService } from '../../services/notification.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends baseHttp {
    constructor(inj: Injector, _notificationService: NotificationService) {
        super(inj, _notificationService);
    }

    login(model: Ilogin): Observable<IHttpResponse<ILoginResponse>> {
        const url = this.apiManger.AuthApis.loginUrl;
        return this.post<ILoginResponse>(url, model);
    }
    saveUserDataToLocalStorage(userData:any) {
        localStorage.setItem('commonName', userData.commonName);
        localStorage.setItem('firstName', userData.firstName);
        localStorage.setItem('lastName', userData.lastName);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('title', userData.title);
        localStorage.setItem('department', userData.department);
    }
}
