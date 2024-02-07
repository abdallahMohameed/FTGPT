import { Injectable, Inject } from '@angular/core';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/components/prism-css';
import 'prismjs/components';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-csharp';

// eslint-disable-next-line no-var
declare var Prism: any;
@Injectable({
    providedIn: 'root'
})
export class HighlightService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    }


    highlightAll() {
        // Prism.hooks.add('before-highlight', function(env) {
        //     let language = Languages[env.language] || env.language;
        //     env.element.setAttribute('data-language', language);
        // });
        if (isPlatformBrowser(this.platformId)) {
            Prism.hooks.add("before-highlight", function (env:any) {
                env.code = env.element.innerText;
            });
            Prism.highlightAll();
        }
    }
}