import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    moduleId: module.id,
    templateUrl: './eddies-show.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class EddiesShowComponent {
    store: any;

    isLoading = true;
    showChart = false;
    chartNum: number = 0;
    selectedPage: string = 'https://www.att.com/buy/byod/';
    selectedPage1: string = 'https://www.att.com/wireless/byod/';
    barChartDuration = ['1 Month', '2 Months', '3 Months'];
    barChartDurationSelected = '1 Month';
    pagesOptions = [
        'All',
        'https://www.att.com/',
        'https://www.att.com/deals/',
        'https://www.att.com/buy/phones/',
        'https://www.att.com/buy/phones/apple-iphone-15-pro-max.html',
        'https://www.att.com/buy/phones/planconfig/apple-iphone-15-pro-max.html?edit=losg-wls-new-001',
        'https://www.att.com/buy/phones/config/apple-iphone-15-pro-max.html?edit=losg-wls-new-001',
        'https://www.att.com/buy/byod/',
        'https://www.att.com/wireless/',
        'https://www.att.com/wireless/byod/',
        'https://www.att.com/buy/byod/identify?devicetype=phone',
        'https://www.att.com/buy/byod/sim',
        'https://www.att.com/buy/phones/planconfig/universal-sim-card-bring-your-own-phone.html?isByod=true&edit=losg-wls-new-003',
        'https://www.att.com/buy/shoppingcart/?flowtype=wireless',
        'https://www.att.com/buy/checkout/checkoutview',
    ];
    sesssionEddiesSelected = 'All';
    sesssionEddiesPCSelected = 'All';

    constructor(public storeData: Store<any>) {
        this.initStore();
        this.isLoading = false;
    }
    displayChart(num: number) {
        this.showChart = true;
        this.chartNum = num;
    }
    hideChart() {
        this.showChart = false;
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

                if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading || hasChangeTheme) {
                    } else {
                        setTimeout(() => {}, 300);
                    }
                }
            });
    }
}
