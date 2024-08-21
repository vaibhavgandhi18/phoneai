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
  templateUrl: "./askEVAPlayground.html",
  styleUrls: ["./askEVAPlayground.scss"],
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
export class AskEVAPlaygroundComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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
      sender: "Ask Eva",
      message:
        "Hi, is this Vaibhav Gandhi? I'm calling from AT&T, just following up on your form inquiry.",
      interval: 500,
    },
    {
      sender: "Customer",
      message: "Hey. Hi. Speaking.",
      interval: 500,
    },
    {
      sender: "Ask Eva",
      message: "Awesome, hi, is now an okay time to talk?",
      interval: 500,
    },
    {
      sender: "Customer",
      message: "Yeah. Sure.",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "Absolutely, I just wanted to check in and ask a few more questions. Could you share a bit more info about the service you are looking for?",
      interval: 500,
    },
    {
      sender: "Customer",
      message:
        "Yeah. So I'm trying to set up a new workspace and need Internet services there.",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "Okay, so you're looking to get internet set up at your new workspace. Are you interested in our AT&T Fiber internet services for your business?",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "Yes",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "Great! AT&T Fiber is a fantastic option for businesses. Can you tell me a little bit more about your internet needs? How many devices will be connected to the internet at your workspace?",
      interval: 0,
    },
    {
      sender: "Customer",
      message:
        "I believe 150 will be connected and it's a development team that will be there, so we will be needing high bandwidth",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "I totally understand. A development team requires a lot of bandwidth for their work. We have some great options for high-bandwidth internet with our AT&T Fiber services. Can you tell me a little bit more about your current timeline for getting this set up?",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "Oh, like, within a week or so?",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "Okay, so you're looking to get set up within the next week or so. That's a pretty tight timeline. Let me check on availability in your area. Can you please confirm your address for me?",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "So it's 20205 North Creek Parkway, Bothell, Washington",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message: "Wait",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "I apologize for the pause. I'm checking on the availability of our AT&T Fiber services at your location. Can you please confirm that you're still with me?",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "Yeah. I'm there.",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "Okay, great. I've checked on the availability, and I'm happy to report that our AT&T Fiber services are available at your location. I can offer you a plan that should meet your high-bandwidth needs.",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "Sure.",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "Our business fiber plans start at five hundred ninety-five dollars per month for a one-gigabit connection. We also have a two-gigabit connection available for nine hundred ninety-five dollars per month. Which of these options sounds more suitable for your development team?",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "I think the 2 gigabit connection is good.",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "The two-gigabit connection will definitely provide your development team with the high-bandwidth internet they need. I can go ahead and set up the installation for you. Would you like to schedule the installation for within the next week, as you mentioned earlier?",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "Yes, please.",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "I've gone ahead and scheduled the installation for within the next week. You'll receive a confirmation email with the exact date and time of the installation. Is there anything else I can assist you with today, or is that all taken care of?",
      interval: 0,
    },
    {
      sender: "Customer",
      message: "That is all.",
      interval: 0,
    },
    {
      sender: "Ask Eva",
      message:
        "Alright, thank you so much for your time today. I'm glad we could get your AT&T Fiber internet set up for your new workspace. You should receive a confirmation email shortly. Have a great day, and thank you for choosing AT&T!",
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
    this.callLog.src = "../assets/SalesCallLog.wav"; // Path to your audio file
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
    setTimeout(() => (this.summary = true), 2000);
  }

  getFormattedTime(): string {
    const minutesFormatted = String(this.minutes).padStart(2, "0");
    const secondsFormatted = String(this.seconds).padStart(2, "0");
    return `${minutesFormatted}:${secondsFormatted}`;
  }
}
