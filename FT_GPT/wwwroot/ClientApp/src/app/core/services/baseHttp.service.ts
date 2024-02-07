import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/app/enviroments/environment';
import { apiManger } from 'src/app/core/APIs/api-manger';
import { IHttpResponse } from 'src/app/shared/interfaces/IHttpResponse';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class baseHttp {


    private http: HttpClient;
    private readonly baseUrl;
    apiManger = apiManger;
    constructor(injector: Injector, public _notificationService: NotificationService) {
        this.http = injector.get(HttpClient);
        this.baseUrl = environment.baseUrl;
    }

    protected get<T>(url: string): Observable<IHttpResponse<T>> {
        return this.http.get<IHttpResponse<T>>(`${this.baseUrl}/${url}`);
    }

    protected post<T>(url: string, data?: any): Observable<IHttpResponse<T>> {
        return this.http.post<IHttpResponse<T>>(`${this.baseUrl}/${url}`, data);
    }

    protected put<T>(url: string, data?: any): Observable<IHttpResponse<T>> {
        return this.http.put<IHttpResponse<T>>(`${this.baseUrl}/${url}`, data);
    }
    errorHandler(error: HttpErrorResponse) {
        this._notificationService.setNotification({message:error.message ?? "common.messages.error", type:"error"});
        return throwError(error.message || "server error.");
    }

}
