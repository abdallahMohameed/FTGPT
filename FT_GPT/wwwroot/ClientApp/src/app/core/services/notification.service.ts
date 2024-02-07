import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    notification = new BehaviorSubject({message:"", type:""});

    setNotification(Notification: any) {
        this.notification.next(Notification);
    }
}
