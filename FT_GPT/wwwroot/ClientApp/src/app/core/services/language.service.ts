import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
export type ILang = 'en' | 'ar';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private currentLangrage = new BehaviorSubject('en');
    currentCurrentLang = this.currentLangrage.asObservable();
    currentDirection = "ltr";

    constructor(
        injector: Injector,
    private _translateService: TranslateService) {
    }

    toggleLang(language: ILang = 'en') {
        language = (language) ? language : 'en';
        this._translateService.setDefaultLang(language);
        this._translateService.use(language);
        localStorage.setItem('language', language);
        this.changeHTMLDirByLanguage(language);
    }

    changeHTMLDirByLanguage(language: ILang ) {
        const condition = language === 'ar' ? 'rtl' : 'ltr';
        const conditionReverse = language === 'en' ? 'rtl' : 'ltr';
        this.currentDirection = condition;
        const html = document.getElementById('main');
        document.getElementById("main")?.setAttribute("dir", condition);
        this.currentLangrage.next(language);
        if (html?.dir) {
            html.dir = condition;
            html.lang = language;
        }
        document.body.classList.add(condition);
        document.body.classList.remove(conditionReverse);
    }
}
