import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { ChatContentComponent } from './components/chat-content/chat-content.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TypingAnimationDirective } from 'src/app/shared/Directives/typing-animation.directive';
import { SignalRService } from './services/SignalR/signalr.service';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        ChatComponent,
        SidebarComponent,
        ChatContentComponent,
        TypingAnimationDirective
    ],
    imports: [
        CommonModule,
        ChatRoutingModule,
        FormsModule
    ],
    providers: [SignalRService]
})
export class ChatModule { }
