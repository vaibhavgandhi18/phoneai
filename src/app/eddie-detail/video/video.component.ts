import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/dataservice.service';

@Component({
    selector: 'app-video',
    providers: [],
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, AfterViewInit {
    @ViewChild('videoContainer', { static: false }) videoContainer: any;
    @ViewChild('myDialog', { static: false }) myDialog: any;
    @ViewChild('modal2') modal2: any;
    videoSource: string = '/assets/video/1.mp4';
    processing: boolean = false;
    ticketsubmited: boolean = false;
    currentItem: any;
    constructor(private dataService: DataService) {}

    ngOnInit() {}

    ngAfterViewInit() {
        this.dataService.currentSource.subscribe((value) => {
            if (value) {
                this.videoSource = value;
                console.log('video source:', this.videoSource);
                if (this.videoContainer) {
                    this.videoContainer.nativeElement.load();
                    //this.videoContainer.nativeElement.play();
                }
            }
        });
        this.dataService.currentItem.subscribe((value) => {
            if (value) {
                this.currentItem = value;

                console.log('current item:', this.currentItem);
            }
        });
    }

    closedialog(value: any, evt: any) {
        //alert("closedialog");
        this.processing = true;
        //this.myDialog.show();
        //this.myDialog.close();

        setTimeout(() => {
            console.log('evt', evt);
            evt.close();
            this.modal2.close();
            this.ticketsubmited = true;
        }, 2000);
    }
}
