import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-eddie-detail',
    templateUrl: './eddie-detail.component.html',
    styleUrls: ['./eddie-detail.component.scss'],
})
export class EddieDetailComponent implements OnInit {
    param: string = '';

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.param = this.route.snapshot.paramMap.get('id')!;
        console.log(this.param);
    }
}
