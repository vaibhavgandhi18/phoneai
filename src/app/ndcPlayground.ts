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
  templateUrl: "./ndcPlayground.html",
  styleUrls: ["./ndcPlayground.scss"],
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
export class NDCPlaygroundComponent
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
      sender: "NDC",
      message:
        "Hi, this is AT&T Mobility National Dispatch Center calling for a message for Nick assigning a ticket.",
      interval: 800,
    },
    {
      sender: "Customer",
      message: "Hey. It's Nick here.",
      interval: 3500,
    },
    {
      sender: "NDC",
      message:
        "A critical severity ticket TT00000080509243 is assigned to you. Do you want to acknowledge the ticket?",
      interval: 1000,
    },
    {
      sender: "Customer",
      message: "Yes. Go ahead.",
      interval: 3000,
    },
    {
      sender: "NDC",
      message:
        "You are all set. Ticket is fully assigned and acknowledged now.",
      interval: 3000,
    },
    {
      sender: "Customer",
      message: "Can you share the ticket description?",
      interval: 0,
    },
    {
      sender: "NDC",
      message:
        "Issue: Reporting two ten-gigabit network links are down and The issue has been occurring since July twenty-ninth, two thousand twenty-four, at ten twenty-three oh two Mountain Standard Time. Impact: The outage is causing sixty-nine sites to operate in simplex mode.",
      interval: 0,
    },
    {
      sender: "Customer",
      message:
        "Okay. Thanks for that information. Can you please share the notation?",
      interval: 0,
    },
    {
      sender: "NDC",
      message:
        "The location is one five seven Houston Circle, Idaho Falls, Idaho eight three four zero two.",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "Okay. Thanks.",
      interval: 0,
    },
    {
      sender: "NDC",
      message: "You're welcome, Nick. Anything else you wish to confirm?",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "No. I'm good. Thank you.",
      interval: 0,
    },
    {
      sender: "NDC",
      message: "You're welcome, Nick. Have a great day. Goodbye.",
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
    this.callLog.src = "../assets/CallLog_NDC_case_1-ticket-acknowledge.wav"; // Path to your audio file
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
    const typingSpeed = 75; // Adjust typing speed as needed

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
