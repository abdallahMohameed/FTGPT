/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Retrieve the token from wherever you store it (e.g., localStorage)
        const token = localStorage.getItem('token');
        const lang = localStorage.getItem('language') ?? 'en';

        // Clone the request and add the Authorization header with the token
        if (token) {
            const clonedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                    'Accept-Language':lang
                }
            });
            return next.handle(clonedReq);
        }

        // If there is no token, proceed with the original request
        return next.handle(req);
    }
}