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
    {
      sender: "EVA",
      message:
        "Hi, is this Richa Rai? I'm calling from AT&T Express Ticketing, just following up on your inquiry.",
      interval: 1000,
    },
    { sender: "Customer", message: "Thanks for your call.", interval: 1000 },
    {
      sender: "EVA",
      message: "Awesome, hi Richa. Is now an okay time to talk?",
      interval: 1000,
    },
    { sender: "Customer", message: "Yes. We can talk.", interval: 1000 },
    {
      sender: "EVA",
      message:
        "Absolutely, I just wanted to check in and ask a few more questions. Could you share a bit more info about what the issue is with your ticket, zero zero zero zero zero three two eight five six seven six one seven?",
      interval: 1000,
    },
    {
      sender: "Customer",
      message: "I'm facing network latency issue.",
      interval: 1000,
    },
    {
      sender: "EVA",
      message:
        "I apologize for the inconvenience. I'd be happy to help escalate this ticket for you. Can you tell me a little bit more about what you're experiencing with the network latency issue?",
      interval: 1000,
    },
    {
      sender: "Customer",
      message:
        "So this issue is intermittent. And it has started coming around 4 to 5 days week.",
      interval: 1000,
    },
    { sender: "EVA", message: "Okay, so the i-", interval: 1000 },
    {
      sender: "Customer",
      message: "And my all employees are getting affected",
      interval: 1000,
    },
    {
      sender: "EVA",
      message:
        "I understand. So, it sounds like the intermittent network latency issue is affecting all of your employees, and it started around four to five days ago. Have you noticed any patterns or triggers that might be contributing to this issue?",
      interval: 1000,
    },
    { sender: "Customer", message: "No.", interval: 1000 },
    {
      sender: "EVA",
      message:
        "Okay, no problem. I'm going to go ahead and escalate this ticket for you. I'll make sure to add some notes to the ticket so our team can investigate this further. Can you please confirm your availability for the next twenty-four to forty-eight hours in case our team needs to reach out to you for further troubleshooting?",
      interval: 1000,
    },
    {
      sender: "Customer",
      message: "It would be around I will be available 9 to 5.",
      interval: 1000,
    },
    {
      sender: "EVA",
      message:
        "Perfect, thank you for letting me know. I'll make sure to note that you're available between nine A M and five P M. I'll also go ahead and escalate this ticket to our advanced technical support team. They'll reach out to you within the next twenty-four to forty-eight hours to further assist you with the network latency issue. Is there anything else I can assist you with today?",
      interval: 1000,
    },
    {
      sender: "Customer",
      message: "I'm expecting a follow-up call.",
      interval: 1000,
    },
    {
      sender: "EVA",
      message:
        "Absolutely, you can expect a follow-up call from our advanced technical support team within the next twenty-four to forty-eight hours. They'll be in touch with you to discuss the progress on your ticket and work towards resolving the network latency issue. Is there a specific time of day that works best for you to receive that follow-up call?",
      interval: 1000,
    },
    {
      sender: "Customer",
      message: "As early as 9 AM to 5 PM.",
      interval: 1000,
    },
    {
      sender: "EVA",
      message:
        "Got it, I've noted that you're available for a follow-up call between nine A M and five P M. We'll make sure to schedule the call within that timeframe. Thank you for your patience and cooperation, Richa. I'm going to go ahead and wrap up this call. Is there anything else you'd like to add or discuss before we hang up?",
      interval: 1000,
    },
    { sender: "Customer", message: "No. Thanks so much.", interval: 1000 },
    {
      sender: "EVA",
      message: "You're welcome, Richa. It was my pleasure to assist you.",
      interval: 1000,
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
