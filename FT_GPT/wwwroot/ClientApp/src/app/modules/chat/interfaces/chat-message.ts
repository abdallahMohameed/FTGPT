export interface ChatMessage {

     role: ChatCompletionRequestMessageRoleEnum;

     content?: string;

     name?: string;
}
export enum ChatCompletionRequestMessageRoleEnum {
    System = 'system',
    User = 'user',
    Assistant = 'assistant',
    Function = 'function',
}
