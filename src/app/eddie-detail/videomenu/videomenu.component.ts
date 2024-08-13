import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/dataservice.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-videomenu',

    templateUrl: './videomenu.component.html',
    styleUrls: ['./videomenu.component.scss'],
})
export class VideomenuComponent implements OnInit {
    sourceData: any;
    filteredData: any;
    loacupdate: boolean = false;
    uniqueSentiments: { sentiment: string; count: number }[] = [];
    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.dataService.currentsourceData.subscribe((value) => {
            if (value) {
                this.sourceData = value;
            }
        });

        this.dataService.currentfilteredData.subscribe((value) => {
            if (value) {
                this.filteredData = value;
                this.getUniqueSentiments();
            }
        });
    }

    dofilter(value: any) {
        console.log('filtering by sentiment:', value.sentiment);
        this.loacupdate = true;
        this.dataService.setFilteredData(this.sourceData.filter((item: any) => item.Emotion === value.sentiment));
    }

    getUniqueSentiments() {
        if (this.loacupdate == true) {
            this.loacupdate = false;
            return;
        }
        //this.firsttime = false;
        this.uniqueSentiments = [];
        // Iterate through the filteredData array
        for (const data of this.filteredData) {
            const sentiment = data.Emotion;

            // Check if the sentiment already exists in uniqueSentiments
            const existingSentiment = this.uniqueSentiments.find((item) => item.sentiment === sentiment);

            if (existingSentiment) {
                // If the sentiment already exists, increment the count
                existingSentiment.count++;
            } else {
                // If the sentiment doesn't exist, add it to uniqueSentiments with count 1
                this.uniqueSentiments.push({ sentiment, count: 1 });
            }
        }
    }
}
