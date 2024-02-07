import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    currentUrl = "";
    chatUrl = "chat/";

    constructor(private router: Router) { }

    navigateToHomePage() {
        this.router.navigateByUrl(this.chatUrl);
    }
}