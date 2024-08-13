import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private source = new BehaviorSubject<string>('');
    private sourceData = new BehaviorSubject<any>('');
    private filteredData = new BehaviorSubject<any>('');
    private item = new BehaviorSubject<any>('');

    constructor() {}

    currentSource = this.source.asObservable();
    currentsourceData = this.sourceData.asObservable();
    currentfilteredData = this.filteredData.asObservable();
    currentItem = this.item.asObservable();

    setSource(newSource: string) {
        this.source.next(newSource);
    }

    setSourceData(newSourceData: any) {
        this.sourceData.next(newSourceData);
    }

    setFilteredData(newFilteredData: any) {
        this.filteredData.next(newFilteredData);
    }

    setItem(newitem: any) {
        this.item.next(newitem);
    }
}
