import { ChatMessage } from "./chat-message";

export interface ChatHistoryDetails {
    id: string;
    title: string;
    messages: ChatMessage[];
  }