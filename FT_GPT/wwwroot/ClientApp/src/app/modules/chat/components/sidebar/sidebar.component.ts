import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { ChatDataService } from '../../services/chatData/chat-data.service';
import { ChatService } from '../../services/chat/chat.service';
import { ChatMessage } from '../../interfaces/chat-message';
import { ChatHistoryDetails } from '../../interfaces/chat-history-details';
import {ChatHistories} from '../../interfaces/chat-histories';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    constructor(
    private chatDataService: ChatDataService,
    private chatService: ChatService,
    private router: Router
    ) {}

    messages: ChatMessage[] = [];
    chatHistories: ChatHistories = {
        chatHistoryDetails: []
    };
    apiKey = '';
    isHistoricalChat = false;

    ngOnInit(): void {
        this.chatService.getMessagesSubject().subscribe((messages:any) => {
            this.messages = messages;
        });
        this.chatHistories = this.getCurrentChatHistoriesFromLocalStorage();
    }

    async addNewChat() {
        if (this.isHistoricalChat === false) {
            const chatHistoryId = uuidv4();
            const title = "title";
            //  (await this.chatService.getTitleFromChatGpt(this.messages)).data.choices[0].message?.content!;

            const chatHistory: ChatHistoryDetails = {
                id: chatHistoryId,
                messages: this.messages,
                title: 'title'
            };

            this.chatHistories = this.getCurrentChatHistoriesFromLocalStorage();

            if (this.checkIsChatHistoryExists(chatHistory.id) === false) {
                this.chatHistories.chatHistoryDetails.unshift(chatHistory);

                this.setChatHistoriesToLocalStorage(this.chatHistories);
            }
        }
        this.chatService.setMessagesSubject([]);
        this.isHistoricalChat = false;
    }

    getHistoryChatMessages(id: string) {
        const history = this.chatHistories.chatHistoryDetails.find(
            (c:any) => c.id === id
        );

        if (history) {
            this.chatService.setMessagesSubject(history.messages);
            this.isHistoricalChat = true;
        }
    }

    getCurrentChatHistoriesFromLocalStorage(): ChatHistories {
        const currentHistories = localStorage.getItem('chatHistories');

        if (currentHistories) {
            const histories = JSON.parse(currentHistories) as ChatHistories;
            return {
                chatHistoryDetails: histories.chatHistoryDetails
            };
        }

        return {
            chatHistoryDetails: []
        };
    }

    setChatHistoriesToLocalStorage(chatHistories: ChatHistories) {
        localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
    }

    deleteHistoricalChat(id: string) {
        this.chatHistories.chatHistoryDetails =
      this.chatHistories.chatHistoryDetails.filter((c:any) => c.id !== id);

        this.setChatHistoriesToLocalStorage(this.chatHistories);
    }


    private checkIsChatHistoryExists(id: string) {
        const result = this.chatHistories.chatHistoryDetails.some(
            (c:any) => c.id === id
        );
        console.log(result);
        return result;
    }
}
