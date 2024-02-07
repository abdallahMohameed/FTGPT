import { Component, OnInit } from '@angular/core';
import { NotificationService } from './core/services/notification.service';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Clean Architecture';

    constructor(
        private NotificationService:NotificationService,
        private notifierService:NotifierService,
       private _translateService: TranslateService
    ) {

    }
    ngOnInit(): void {
        this.subscribeToAppNotifications();
    }
    subscribeToAppNotifications() {
        this.NotificationService.notification.subscribe(data=>{
            if (data.message != "" && data.message != null && data.message != undefined) {
                this.notifierService.notify(data.type, this._translateService.instant(data.message));
            }
        });
    }


}
