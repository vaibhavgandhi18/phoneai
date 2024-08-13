import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { animate, style, transition, trigger } from "@angular/animations";
import { FileUploadWithPreview } from "file-upload-with-preview";
import { AIDataService } from "./service/aidata.service";

@Component({
  moduleId: module.id,
  templateUrl: "./index.html",
  styleUrls: ["./index.scss"],
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
export class IndexComponent implements OnInit {
  store: any;
  isLoading = true;
  aiCallsData: any;
  activeCallDataIndex = 0;
  circumference: number = 2 * Math.PI * 35;

  constructor(
    public storeData: Store<any>,
    private aiDataService: AIDataService
  ) {
    this.initStore();

    this.isLoading = false;
  }
  ngOnInit(): void {
    this.getCallData();
  }
  getCallData() {
    this.aiDataService.getData().subscribe((response) => {
      this.aiCallsData = response;
    });
  }
  setCallItem(index: number) {
    console.log(index);
    this.activeCallDataIndex = index;
  }
  getOffset(score: number) {
    return this.circumference - (score / 100) * this.circumference;
  }
  getTypeColor(type: string) {
    console.log(type);
    if (type.trim() == "Satisfied") return "rgb(67 97 238)";
    if (type.trim() == "Frustrated") return "rgb(226 160 63)";
    if (type.trim() == "Happy") return "rgb(0 171 85)";
    if (type.trim() == "Angry") return "rgb(231 81 90)";
    if (type.trim() == "Unsure") return "rgb(128 93 202)";
    else return "";
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
      });
  }
}
