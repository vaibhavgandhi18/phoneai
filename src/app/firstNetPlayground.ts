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
  templateUrl: "./firstNetPlayground.html",
  styleUrls: ["./firstNetPlayground.scss"],
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
export class FirstNetPlaygroundComponent
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
      sender: "FirstNet Support",
      message: "Hi, this is AT&T FirstNet Support. How can I assist you today?",
      interval: 1000,
    },
    {
      sender: "James",
      message: "I'm calling AT&T to report an issue with my device network.",
      interval: 1000,
    },
    {
      sender: "FirstNet Support",
      message:
        "I'm sorry to hear you're having an issue with your device network. Could you please provide me with a few more details so I can assist you? What is your name and the phone number you're calling from?",
      interval: 300,
    },
    {
      sender: "James",
      message:
        "My name is James Weber. And the phone number I'm calling from is 4252365436",
      interval: 1000,
    },
    {
      sender: "FirstNet Support",
      message:
        "Okay, got it. The phone number you're calling from is 425-236-5436. Can you confirm that for me?",
      interval: 1000,
    },
    {
      sender: "James",
      message: "Yes",
      interval: 1000,
    },
    {
      sender: "FirstNet Support",
      message:
        "Okay, James, thanks for confirming the phone number. Based on the information you've provided, it looks like this device is registered under Foundation Account number 57689481. Is that correct?",
      interval: 100,
    },
    {
      sender: "James",
      message: "Yes",
      interval: 100,
    },
    {
      sender: "FirstNet Support",
      message:
        "Okay, great. Now, can you please tell me what issue you're experiencing with your network?",
      interval: 100,
    },
    {
      sender: "James",
      message:
        "Since morning, I couldn't send any text messages. Looks like the text message is broken in the area I am now.",
      interval: 200,
    },
    {
      sender: "FirstNet Support",
      message:
        "Okay, James, can you please confirm the location where you're experiencing this issue with text messaging?",
      interval: 200,
    },
    {
      sender: "James",
      message: "20205. North Creek Parkway, Bothell, Washington.",
      interval: 200,
    },
    {
      sender: "FirstNet Support",
      message:
        "Okay, thanks for providing that location information, James. It looks like you're at 20205 North Creek Parkway in Bothell, Washington. Can you confirm if your phone and data services are currently working in that area, or is it just the text messaging that's impacted?",
      interval: 100,
    },
    {
      sender: "James",
      message:
        "That's correct. The phone and data seems to be okay. Only text is not going.",
      interval: 100,
    },

    {
      sender: "FirstNet Support",
      message:
        "Okay, James, thank you for that information. It sounds like the issue is isolated to just text messaging, and your phone and data services are still working properly in that area. I'll go ahead and create a ticket to get this investigated and resolved as soon as possible. Is there anything else you'd like to add before I do that?",
      interval: 0,
    },
    {
      sender: "James",
      message: "No",
      interval: 0,
    },
    {
      sender: "FirstNet Support",
      message:
        "Thank you for reporting this issue, James. We will create a ticket and get this resolved as soon as possible. Have a great rest of your day.",
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
    this.callLog.src = "../assets/firstNet.wav"; // Path to your audio file
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
