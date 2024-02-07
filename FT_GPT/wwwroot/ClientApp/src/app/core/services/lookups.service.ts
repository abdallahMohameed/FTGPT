import { Injectable, Injector } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { baseHttp } from 'src/app/core/services/baseHttp.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Injectable({
    providedIn: 'root'
})
export class LookupsService extends baseHttp {

    constructor(inj: Injector, _notificationService: NotificationService) {
        super(inj, _notificationService);
    }

    getLookups(lookups: string[]): Observable<any[]> {
        const url = this.apiManger.lookupsApi.getLookupUrl;
        return this.post<any[]>(url, {tableName: lookups}).pipe(
            map(response => response.content),
            catchError(error => this.errorHandler(error))
        );
    }
}
