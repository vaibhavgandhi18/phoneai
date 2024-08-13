import { Component, OnInit, AfterViewInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../service/dataservice.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, AfterViewInit {
    sourceData: any;
    filteredData: any;
    thumbnailUrl: any;
    comeltedtumnail: boolean = false;
    element = new BehaviorSubject<any>('');
    recordcount: number = -1;
    currentElement = this.element.asObservable();
    active: number = 0;

    url: string = '/assets/data/finaldata.json';
    //url: string = '/assets/data/finaldata20.json';

    constructor(private dataService: DataService, private router: Router) {}

    private trimData(data: any): any {
        if (typeof data === 'string') {
            return data.trim();
        } else if (Array.isArray(data)) {
            return data.map((item) => this.trimData(item));
        } else if (typeof data === 'object' && data !== null) {
            const trimmedData: any = {};
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    trimmedData[key] = this.trimData(data[key]);
                }
            }
            return trimmedData;
        } else {
            return data;
        }
    }
    ngOnInit() {
        this.currentElement.subscribe((element) => {
            this.recordcount += 1;
            //console.log("element", element.thumbnail, this.recordcount);
            if (this.recordcount == 1) {
                this.setvideosource(element, 0);
            }
            if (this.sourceData && this.recordcount < this.sourceData.length) {
                let element = this.sourceData[this.recordcount];
                if (element['Filename']) {
                    this.generateThumbnail('/assets/video/' + element['Filename'], 0.0, element);
                } else {
                    element.thumbnail = '/assets/images/placeholder-image.jpg';
                    this.element.next(element);
                }
            } else {
                this.recordcount = -1;
                this.dataService.setSourceData(this.sourceData);
                this.dataService.setFilteredData(this.sourceData);
                this.comeltedtumnail = true;
            }
        });
        console.log(this.router.url);
        if (this.router.url === '/eddies-playback/show') {
            this.url = '/assets/data/finaldata20.json';
        }

        fetch(this.url)
            .then((res) => res.json())
            .then((json) => {
                this.sourceData = json['ATT_C_Sales_V5'];
                this.sourceData = this.trimData(this.sourceData);
                this.dataService.setSourceData(this.sourceData);
                this.dataService.setFilteredData(this.sourceData);
                if (this.sourceData.length > 0) {
                    let element = this.sourceData[0];
                    if (element['Filename']) {
                        this.generateThumbnail('/assets/video/' + element['Filename'], 0.0, element);
                    } else {
                        element.thumbnail = '/assets/images/placeholder-image.jpg';
                    }
                }
                //this.dataService.setSourceData(this.sourceData);
                // //console.log(this.sourceData);
                // this.sourceData.forEach( (element: any) => {
                //   if (element["Filename"]) {

                //     if (this.firsttime == true){
                //       this.generateThumbnail("/assets/video/" + element["Filename"], 0.0, element);
                //       this.firsttime = false;
                //     }
                //   }else {
                //     element.thumbnail = "/assets/images/placeholder-image.jpg";
                //   }

                // });
            });
    }
    ngAfterViewInit() {
        this.dataService.currentfilteredData.subscribe((value) => {
            if (value) {
                this.updateData(value);
            }
        });
    }

    updateData(value: any) {
        if (this.comeltedtumnail == true) {
            this.filteredData = value;
            this.sourceData = this.filteredData;
        } else {
            // setTimeout(() => { this.updateData(value); }, 1000);
        }
        // this.sourceData.forEach(async (element: any) => {
        //   if (element["Filename"]) {
        //     await this.generateThumbnail("/assets/video/" + element["Filename"], 0.0, element);
        //     //console.log("thumbnail", element.thumbnail);
        //   } else {
        //     element.thumbnail = "/assets/images/placeholder-image.jpg";
        //   }
        // });
    }

    setvideosource(data: any, i: number) {
        this.active = i;
        this.dataService.setSource('/assets/video/' + data['Filename']);
        this.dataService.setItem(data);
    }

    generateThumbnail(file: any, seekTo = 0.0, element: any) {
        let videoPlayer = document.createElement('video');
        videoPlayer.setAttribute('src', file);
        videoPlayer.load();

        const generateImage = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = videoPlayer.videoWidth;
            canvas.height = videoPlayer.videoHeight;
            if (context) {
                context.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
                //this.thumbnailUrl = canvas.toDataURL('image/jpeg');
                element.thumbnail = canvas.toDataURL('image/jpeg');

                //console.log("thumbnail", element);
                videoPlayer.removeEventListener('seeked', generateImage);
                videoPlayer.remove();
                this.element.next(element);
            }
        };

        videoPlayer.addEventListener('canplaythrough', () => {
            setTimeout(() => {
                videoPlayer.currentTime = seekTo;
            }, 10); // Add a delay of 1 second (adjust as needed)
        });

        videoPlayer.addEventListener('seeked', generateImage);
    }
}
