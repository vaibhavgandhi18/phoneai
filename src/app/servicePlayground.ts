import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AIDataService } from './service/aidata.service';

@Component({
    moduleId: module.id,
    templateUrl: './servicePlayground.html',
    styleUrls: ['./servicePlayground.scss'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class ServicePlaygroundComponent implements OnInit {
    store: any;

    isLoading = true;

    userPrompt = '';
    constructor(public storeData: Store<any>, private router: Router, private aiDataService: AIDataService) {
        this.initStore();
        this.isLoading = false;
    }
    ngOnInit(): void {}

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                const hasChangeTheme = this.store?.theme !== d?.theme;
                const hasChangeLayout = this.store?.layout !== d?.layout;
                const hasChangeMenu = this.store?.menu !== d?.menu;
                const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

                this.store = d;

                if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading || hasChangeTheme) {
                    } else {
                        setTimeout(() => {}, 300);
                    }
                }
            });
    }

    userAgentPost() {
        // this.aiDataService.userAgentCall(4254926201, this.userPrompt).subscribe((response) => {
        //     console.log(response);
        // });
    }
}
