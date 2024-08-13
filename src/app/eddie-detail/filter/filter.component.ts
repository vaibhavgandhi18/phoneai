import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DataService } from '../../service/dataservice.service';
import { CommonModule } from '@angular/common';

interface SortOptions {
    [key: string]: string;
}
@Component({
    selector: 'app-filter',

    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, AfterViewInit {
    @ViewChild('videoContainer', { static: false }) videoContainer: any;
    rawdata: any;
    sourcedata: any = [];
    uniqueTypes: any;
    uniqueEmotion: any;
    uniqueKeywords: any;
    uniqueSeverity: any;
    csatSlider = 0;
    localfilter: boolean = false;
    showReset: boolean = false;
    selectedsortId = 'sortByNewest';

    extractionType: any = [];
    emotionType: any = [];
    severityType: any = [];
    uniqueType: any = [];
    sortOptions: SortOptions = {
        sortByNewest: 'Sort by Newest',
        sortByOldest: 'Sort by Oldest',
        mintoMaxDuration: 'Min to Max Duration',
        maxtoMinDuration: 'Max to Min Duration',
    };
    constructor(private dataService: DataService) {}

    ngOnInit() {}

    ngAfterViewInit() {
        this.dataService.currentsourceData.subscribe((value: any[]) => {
            console.log('source', value);
            if (this.localfilter == true) {
                this.localfilter = false;
                return;
            }

            if (value) {
                this.sourcedata = value;
                this.rawdata = value;
                this.uniqueTypes = this.extractUniqueValues(value, 'Type');
                this.uniqueEmotion = this.extractUniqueValues(value, 'Emotion');
                this.uniqueSeverity = this.extractUniqueValues(value, 'Severity');
                console.log(this.uniqueTypes);
                console.log(this.uniqueEmotion);
            }
        });
    }

    accordianclick(evt: any) {
        for (const child of evt.children) {
            if (child.tagName === 'DIV') {
                child.classList.toggle('show');
            }
            //console.log(child.tagName);
        }
        console.log(evt.childern[1]);
        evt.classList.toggle('active');
        console.log(evt);
    }

    dofilter() {
        this.localfilter = true;
        let finalFilteredData = this.rawdata;

        if (this.extractionType.length > 0) {
            finalFilteredData = finalFilteredData.filter((item: any) => {
                return this.extractionType.includes(item['Type']);
            });
        }
        if (this.emotionType.length > 0) {
            finalFilteredData = finalFilteredData.filter((item: any) => {
                return this.emotionType.includes(item['Emotion']);
            });
        }
        if (this.severityType.length > 0) {
            finalFilteredData = finalFilteredData.filter((item: any) => {
                return this.severityType.includes(item['Severity']);
            });
        }

        this.sourcedata = finalFilteredData;
        this.dataService.setFilteredData(finalFilteredData);
    }
    extractUniqueValues(data: any[], field: string) {
        const uniqueValues: any[] = [];
        data.forEach((item) => {
            if (!uniqueValues.includes(item[field])) {
                uniqueValues.push(item[field]);
            }
        });
        return uniqueValues;
    }
    resetfilter() {
        //this.dataService.setFilteredData(this.sourcedata.filter((item: any) => "1" === "1"));
        this.extractionType = [];
        this.emotionType = [];
        this.severityType = [];
        this.sourcedata = this.rawdata;
        this.dataService.setSourceData(this.rawdata);
        this.dataService.setFilteredData(this.rawdata);
        this.showReset = false;
    }
    resetOnefilter(event: string) {
        if (event == 'extractionType') {
            this.extractionType = [];
        } else if (event == 'emotionType') {
            this.emotionType = [];
        } else if (event == 'severityType') {
            this.severityType = [];
        }
        this.dofilter();
    }
    sortPlayback(sortId: string) {
        this.selectedsortId = sortId;
    }
}
