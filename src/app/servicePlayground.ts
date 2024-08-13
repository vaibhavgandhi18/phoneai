import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { animate, style, transition, trigger } from "@angular/animations";
import { Router } from "@angular/router";
import { AIDataService } from "./service/aidata.service";
interface Message {
  sender: string;
  message: string;
  interval: number;
}
@Component({
  moduleId: module.id,
  templateUrl: "./servicePlayground.html",
  styleUrls: ["./servicePlayground.scss"],
  animations: [
    trigger("toggleAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.95)" }),
        animate("100ms ease-out", style({ opacity: 1, transform: "scale(1)" })),
      ]),
      transition(":leave", [
        animate("75ms", style({ opacity: 0, transform: "scale(0.95)" })),
      ]),
    ]),
  ],
})
export class ServicePlaygroundComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  store: any;
  minutes: number = 0;
  seconds: number = 0;
  private intervalId: any;
  isLoading = true;
  callStatus = "";

  userPrompt = "";
  callLog: any;
  callerTune: any;
  messages: Message[] = [
    { sender: "User", message: "Hi there!", interval: 1000 },
    { sender: "Bot", message: "Hello! How can I help you?", interval: 2000 },
    { sender: "User", message: "I need some assistance.", interval: 1500 },
    {
      sender: "Bot",
      message: "Sure, what do you need help with?",
      interval: 2500,
    },
  ];
  displayedMessages: { sender: string; displayedText: string }[] = [];
  private currentMessageIndex: number = 0;
  constructor(
    public storeData: Store<any>,
    private router: Router,
    private aiDataService: AIDataService
  ) {
    this.initStore();
    this.isLoading = false;
    this.callerTune = new Audio();
    this.callerTune.src = "../assets/caller_tune.wav"; // Path to your audio file
    // this.callerTune.load();
    // this.callerTune.play();
    this.callLog = new Audio();
    this.callLog.src = "../assets/evaCallLog.wav"; // Path to your audio file
    this.callLog.load();
  }
  ngAfterViewInit(): void {
    this.callerTune.load();

    setTimeout(() => {
      this.callerTune.play();
    }, 2000);
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.clearTimer();
  }

  async initStore() {
    this.storeData
      .select((d) => d.index)
      .subscribe((d) => {
        const hasChangeTheme = this.store?.theme !== d?.theme;
        const hasChangeLayout = this.store?.layout !== d?.layout;
        const hasChangeMenu = this.store?.menu !== d?.menu;
        const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

        this.store = d;

        if (
          hasChangeTheme ||
          hasChangeLayout ||
          hasChangeMenu ||
          hasChangeSidebar
        ) {
          if (this.isLoading || hasChangeTheme) {
          } else {
            setTimeout(() => {}, 300);
          }
        }
      });
  }
  displayNextMessage(): void {
    if (this.currentMessageIndex < this.messages.length) {
      const message = this.messages[this.currentMessageIndex];
      this.typeMessage(message);
    } else {
      this.clearTimer();
    }
  }

  typeMessage(message: Message): void {
    let currentIndex = 0;
    let displayedText = "";
    const typingSpeed = 120; // Adjust typing speed as needed

    const typeInterval = setInterval(() => {
      displayedText += message.message.charAt(currentIndex);
      this.updateDisplayedMessage(message.sender, displayedText);
      currentIndex++;

      if (currentIndex === message.message.length) {
        clearInterval(typeInterval);
        this.currentMessageIndex++;
        setTimeout(() => this.displayNextMessage(), message.interval);
      }
    }, typingSpeed);
  }

  updateDisplayedMessage(sender: string, displayedText: string): void {
    if (this.displayedMessages[this.currentMessageIndex]) {
      this.displayedMessages[this.currentMessageIndex].displayedText =
        displayedText;
    } else {
      this.displayedMessages.push({ sender, displayedText });
    }
  }
  userAgentPost() {
    // this.aiDataService.userAgentCall(4254926201, this.userPrompt).subscribe((response) => {
    //     console.log(response);
    // });
  }
  startTimer(): void {
    this.callStatus = "started";
    this.callerTune.pause();
    this.callLog.play();

    this.displayNextMessage();
    this.intervalId = setInterval(() => {
      this.seconds++;

      if (this.seconds === 60) {
        this.minutes++;
        this.seconds = 0;
      }
    }, 1000);
  }

  clearTimer(): void {
    this.callStatus = "ended";
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getFormattedTime(): string {
    const minutesFormatted = String(this.minutes).padStart(2, "0");
    const secondsFormatted = String(this.seconds).padStart(2, "0");
    return `${minutesFormatted}:${secondsFormatted}`;
  }
}
