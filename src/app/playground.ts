import { Component, OnDestroy, OnInit } from "@angular/core";
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
  templateUrl: "./playground.html",
  styleUrls: ["./playground.scss"],
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
export class PlaygroundComponent implements OnInit, OnDestroy {
  store: any;
  isLoading = true;
  userPrompt = "";
  minutes: number = 0;
  seconds: number = 0;
  private intervalId: any;
  userAgentInitiateCall = false;
  callStatus = "";

  messages: Message[] = [
    {
      sender: "Ask Eva",
      message:
        "Hello, thank you for calling AT&T customer support. My name is Ask Eva. How can I assist you today?",
      interval: 500,
    },
    {
      sender: "Breezy",
      message:
        "Hello. Thank you for answering. My name is Alex.Calling about an issue with my current month's mobile bill.I noticed an additional charge of $100 for international roaming and I'd like to dispute it.Could you please help me with that?",
      interval: 500,
    },

    { sender: "Ask Eva", message: "I apologies-", interval: 1500 },
    {
      sender: "Ask Eva",
      message:
        "Yes, of course, Alex. Your account number can be found at the top right corner of your bill, and your PIN is the four-digit code you created when you set up your account. Can you please locate those for me?",
      interval: 2500,
    },
    {
      sender: "Breezy",
      message: "Wait",
      interval: 2500,
    },
    {
      sender: "Breezy",
      message: "Hello? Are you still there? ",
      interval: 2500,
    },
    {
      sender: "Ask Eva",
      message:
        "Yes, I'm still here, Alex. Please go ahead and share your account number and PIN with me.",
      interval: 2500,
    },
    {
      sender: "Breezy",
      message: "Already did.",
      interval: 2500,
    },
    {
      sender: "Ask Eva",
      message: "My account number is 85213456789.And my PIN is 1234.",
      interval: 2500,
    },
    {
      sender: "Ask Eva",
      message:
        "Thank you. Alright, Alex, I've got that. Let me just check on the status of your account. Can you tell me, where did you travel to that incurred the international roaming charge?",
      interval: 2500,
    },
    {
      sender: "Breezy",
      message:
        "I actually didn't travel anywhere. That's why I'm disputing the charge.",
      interval: 1500,
    },
    {
      sender: "Ask Eva",
      message:
        "Okay, Alex, it was my pleasure to assist you with your billing issue. If you have any other questions or concerns in the future, don't hesitate to reach out to us. Have a great day.",
      interval: 2500,
    },
    {
      sender: "Breezy",
      message:
        "Either way is fine. Thank you. Can just email me. That's the easiest.",
      interval: 1500,
    },
    {
      sender: "Ask Eva",
      message: "You're welcome",
      interval: 2500,
    },
    {
      sender: "Breezy",
      message: "Thank you again. Goodbye.",
      interval: 150,
    },
    {
      sender: "Ask Eva",
      message: "You're welcome, Alex. Goodbye.",
      interval: 250,
    },
    {
      sender: "Breezy",
      message: "Ended call",
      interval: 0,
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
    const typingSpeed = 90; // Adjust typing speed as needed

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
  userAgentPost(tune: HTMLAudioElement, callLog: HTMLAudioElement) {
    this.userAgentInitiateCall = true;
    this.startTimer(tune, callLog);
    // this.aiDataService.userAgentCall(4254926201, this.userPrompt).subscribe((response) => {
    //     console.log(response);
    // });
  }
  startTimer(tune: HTMLAudioElement, callLog: HTMLAudioElement): void {
    this.callStatus = "outgoing";

    tune.play();

    setTimeout(() => {
      tune.pause();

      callLog.play();
      this.displayNextMessage();
      this.callStatus = "started";
      this.intervalId = setInterval(() => {
        this.seconds++;

        if (this.seconds === 60) {
          this.minutes++;
          this.seconds = 0;
        }
      }, 1000);
    }, 6000);
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
