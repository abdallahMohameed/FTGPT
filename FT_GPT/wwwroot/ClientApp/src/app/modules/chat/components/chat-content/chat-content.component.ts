/* eslint-disable no-unused-vars */
import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy
} from '@angular/core';
import gsap from 'gsap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from '../../services/chat/chat.service';
import { ChatCompletionRequestMessageRoleEnum, ChatMessage } from '../../interfaces/chat-message';
import { HighlightService } from '../../services/HighlightService/highlight.service';
import { SignalRService } from '../../services/SignalR/signalr.service';

@Component({
    selector: 'app-chat-content',
    templateUrl: './chat-content.component.html',
    styleUrls: ['./chat-content.component.scss']
})
export class ChatContentComponent
implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy
{
    isLightMode = false;
    subscription: any;
    formattedMessages: ChatMessage[] = [];
    constructor(
    private chatService: ChatService,
    public signalRService: SignalRService,
    private highlightService: HighlightService
    ) {}

  @ViewChild('window') window!: any;
  public messages: ChatMessage[] = [];
  apiKey: string | null = '';
  isBusy = false;
  @ViewChild('textInput', { static: true }) textInputRef!: ElementRef;
  @ViewChild('chatContainer') private myScrollContainer!: ElementRef;

  public SignalR_Response = "";


  ngOnInit(): void {
      this.chatService.isLightMode.subscribe((value: boolean) => {
          this.isLightMode = value;
      });
      this.subscription = this.signalRService.getMessageSubject().subscribe(
          (response: any) => {
              this.isBusy = false;
              this.highlightService.highlightAll();
              this.SignalR_Response = this.chatService.addHTMLTagsToResponseCode(response) ;

          },
          (error) => {
              console.error('Error receiving messages:', error);
          }
      );


  }
  toggleTheme() {
      this.chatService.changeChatTheme();
  }

  ngAfterViewInit() {
      this.setupAnimation();
      this.textInputRef.nativeElement.focus();
  }

  ngAfterViewChecked(): void {
      this.highlightService.highlightAll();
  }

  async createCompletion(element: HTMLTextAreaElement) {
      if (this.isBusy != true) {
          const prompt = element.value;
          if (prompt.length <= 1 || this.isBusy) {
              element.value = '';
              return;
          }
          element.value = '';
          const message: ChatMessage = {
              role: ChatCompletionRequestMessageRoleEnum.User,
              content: prompt
          };

          this.messages.push(message);
          try {
              const FillerMessage: ChatMessage = {
                  role:ChatCompletionRequestMessageRoleEnum.Assistant,
                  content: ''
              };
              this.messages.push(FillerMessage);
              this.isBusy = true;
              setTimeout(() => {
                  this.setupAnimation();
              }, 10);
              this.scrollToBottom();

              const completion = await this.chatService.createCompletionViaLocalAI(this.messages);
              const responseMessage: ChatMessage = {
                  role:ChatCompletionRequestMessageRoleEnum.Assistant,
                  content: completion
              };
              if (this.signalRService.checkIfResponseEnded()) {
                  responseMessage.content = this.chatService.addHTMLTagsToResponseCode(this.SignalR_Response) ;
                  this.SignalR_Response = "";
                  this.messages.pop();
                  this.isBusy = false;
                  this.messages.push(responseMessage);
              }
          } catch (err) {
              const errorResponseMessage: ChatMessage = {
                  role:ChatCompletionRequestMessageRoleEnum.Assistant,
                  content: 'error in server'
              };

              this.messages.push(errorResponseMessage);
          }

          this.chatService.setMessagesSubject(this.messages);
          this.scrollToBottom();

      }

  }

  scrollToBottom() {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;

  }
  private setupAnimation(): void {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      tl.to(".left, .right", { duration: 0.4, x: 5 });
      tl.to(".topLid", { duration: 0.1, y: -50 });
      tl.to(".btmLid", { duration: 0.1, y: 50 }, "<");
      tl.to(".topLid", { duration: 0.1, y: 0 });
      tl.to(".btmLid", { duration: 0.1, y: 0 }, "<");
      tl.to(".topLid", { duration: 0.1, y: -50 });
      tl.to(".btmLid", { duration: 0.1, y: 50 }, "<");
      tl.to(".left, .right", { duration: 0.4, x: 30 }, "+=2");
      tl.to(".left, .right", { duration: 0.5, x: -25 });
      tl.to(".left, .right", { duration: 0.4, x: 30 }, "+=.5");
      tl.to(".topLid", { duration: 0.1, y: 0 });
      tl.to(".btmLid", { duration: 0.1, y: 0 }, "<");
      tl.to(".topLid", { duration: 0.1, y: -50 });
      tl.to(".btmLid", { duration: 0.1, y: 50 }, "<");
      tl.to(".left, .right", { duration: 0.4, x: -25 });
      tl.to(".left, .right", { duration: 2.5, rotate: 360 }, "+=1");
      tl.to(".left, .right", { duration: 0.4, x: 5 }, "+=1");
      this.scrollToBottom();

  }
  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
