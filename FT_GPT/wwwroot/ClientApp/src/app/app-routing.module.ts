import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/authentication/components/login/login.component';


const routes: Routes = [
    {
        path: "",
        component:LoginComponent
    },
    {
        path: "chat",
        loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
