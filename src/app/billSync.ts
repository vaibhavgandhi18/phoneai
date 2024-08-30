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
  templateUrl: "./billSync.html",
  styleUrls: ["./billSync.scss"],
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
export class BillSyncComponent implements OnInit, OnDestroy, AfterViewInit {
  store: any;
  minutes: number = 0;
  seconds: number = 0;
  private intervalId: any;
  isLoading = true;
  callStatus = "";
  summary = false;
  userPrompt = "";
  callLog: any;
  callerTune: any;
  messages: Message[] = [
    {
      sender: "Inspector Drain INC",
      message: "Hello",
      interval: 1000,
    },
    {
      sender: "Bill Sync Agent",
      message:
        "Hello, this is Emily from AT&T services. I'm calling about the account for Inspector Drain INC. Their company account has a past due balance of eighteen thousand, four hundred and forty five dollars as of July twentieth. I understand this can be frustrating, but I wanted to reach out and see if we can work together to get this resolved. Is there a good time we could discuss the account and explore payment options that would work for your business? I'm happy to answer any questions you may have.",
      interval: 100,
    },
    {
      sender: "Inspector Drain INC",
      message:
        "I did not know I had a past due. Is there any way that I can pay it in 3 to 5 days?",
      interval: 100,
    },
    {
      sender: "Bill Sync Agent",
      message:
        "I understand, and I'm happy to work with you on that. If you're able to pay the full past due amount of eighteen thousand, four hundred and forty five dollars within the next three to five days, that would be very helpful. I can go ahead and note that on your account, and we'll hold off on any further collection activity during that time. Would you like me to send you a reminder email with the total due and instructions for making the payment? I'm here to help get this resolved as smoothly as possible.",
      interval: 100,
    },
    {
      sender: "Inspector Drain INC",
      message: "Yes. That would be great.",
      interval: 100,
    },
    {
      sender: "Bill Sync Agent",
      message:
        "Okay, great. I'll go ahead and send you an email with the total past due amount of eighteen thousand, four hundred and forty five dollars, and instructions for making the payment within the next three to five days. Please let me know if you have any other questions or concerns. I'm here to work with you to get this resolved.",
      interval: 100,
    },
    {
      sender: "Inspector Drain INC",
      message: "Nope. I'm good. Thank you.",
      interval: 100,
    },
    {
      sender: "Bill Sync Agent",
      message: "Thank you for your time. Have a great rest of your day.",
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
    this.callerTune = new Audio();
    this.callerTune.src = "../assets/caller_tune.wav"; // Path to your audio file
    // this.callerTune.load();
    // this.callerTune.play();
    this.callLog = new Audio();
    this.callLog.src = "../assets/billSync.wav"; // Path to your audio file
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
    this.callerTune.pause();
    this.callLog.pause();
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
    const typingSpeed = 65; // Adjust typing speed as needed

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
    setTimeout(() => (this.summary = true), 2000);
  }

  getFormattedTime(): string {
    const minutesFormatted = String(this.minutes).padStart(2, "0");
    const secondsFormatted = String(this.seconds).padStart(2, "0");
    return `${minutesFormatted}:${secondsFormatted}`;
  }
}
