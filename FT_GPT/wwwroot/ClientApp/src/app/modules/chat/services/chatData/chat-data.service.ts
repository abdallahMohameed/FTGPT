import { Injectable } from '@angular/core';
import { ChatMessage } from '../../interfaces/chat-message';

@Injectable({
    providedIn: 'root'
})
export class ChatDataService {
    totalChatConversation = 0;

    public setLocalStorageForSingleChat(
        chatName: string,
        chatData: ChatMessage
    ): void {
        localStorage.setItem(`${chatName}`, JSON.stringify(chatData));
    }

    public getLocalStorage(chatName: string) {
        return localStorage.getItem(chatName);
    }

    public setTotalChatConversation(chatCount: number) {
        this.totalChatConversation += chatCount;
    }

    public getTotalChatConversation(): number {
        return this.totalChatConversation;
    }

    public setAPIKeyToLocalStore(key: string) {
        localStorage.setItem('apiKey', key);
    }

    public getAPIKeyFromLocalStore(): string | null {
        const apiKey = localStorage.getItem('apiKey');
        if (apiKey) {
            return apiKey;
        }
        return null;
    }
}
