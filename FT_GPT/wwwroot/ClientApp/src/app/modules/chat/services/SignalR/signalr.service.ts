import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection: HubConnection;
    private messageSubject = new Subject<string>();
    MessageResponse = "";
    constructor() {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:52914/chatHub')
            .build();

        this.hubConnection.on('ReceiveMessage', (result: string) => {
            this.MessageResponse += result;
            this.messageSubject.next(this.MessageResponse);
        });

        this.hubConnection.start()
            .then(() => console.log('Connection started!'))
            .catch(err => console.error('Error while establishing connection:', err));
    }

    getMessageSubject() {
        return this.messageSubject.asObservable();
    }
    checkIfResponseEnded() {
        if (this.MessageResponse.includes("User:")) {
            this.MessageResponse =this.MessageResponse.replace("User:", '');

            this.MessageResponse = "";
            return true;
        } else {
            return false;
        }
    }
}