import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: './resource-center.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class ResourceCenterComponent {
    store: any;
    totalVisit: any;
    paidVisit: any;
    uniqueVisitor: any;
    followers: any;
    referral: any;
    engagement: any;
    isLoading = true;
    pageOptions = [
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
    selectedPage = 'All';
    basic1: FlatpickrOptions;
    basic2: FlatpickrOptions;
    form1!: FormGroup;
    constructor(public storeData: Store<any>, public fb: FormBuilder, private router: Router) {
        this.initStore();
        this.isLoading = false;
        this.form1 = this.fb.group({
            date1: ['2024-07-19'],
            date2: ['2024-07-31'],
        });

        this.basic1 = {
            defaultDate: '2024-07-19',
            dateFormat: 'Y-m-d',
            position: this.store.rtlClass === 'rtl' ? 'auto right' : 'auto left',
        };
        this.basic2 = {
            defaultDate: '2024-07-31',
            dateFormat: 'Y-m-d',
            position: this.store.rtlClass === 'rtl' ? 'auto right' : 'auto left',
        };
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
                        this.initCharts(); //init charts
                    } else {
                        setTimeout(() => {
                            this.initCharts(); // refresh charts
                        }, 300);
                    }
                }
            });
    }
    playback(path: any) {
        this.router.navigate(['/eddies-playback', path]);
    }
    initCharts() {
        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;

        // statistics
        this.totalVisit = {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#009688',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#009688'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            series: [
                {
                    data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25],
                },
            ],
        };

        //paid visit
        this.paidVisit = {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#e2a03f',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e2a03f'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            series: [
                {
                    data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69],
                },
            ],
        };

        // unique visitors
        this.uniqueVisitor = {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#5c1ac3', '#ffbb44'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 10,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                y: {
                    formatter: (val: any) => {
                        return val;
                    },
                },
            },
            series: [
                {
                    name: 'Direct',
                    data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
                },
                {
                    name: 'Organic',
                    data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
                },
            ],
        };

        // followers
        this.followers = {
            chart: {
                height: 176,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#4361ee'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            fill: isDark
                ? null
                : {
                      type: 'gradient',
                      gradient: {
                          type: 'vertical',
                          shadeIntensity: 1,
                          inverseColors: !1,
                          opacityFrom: 0.3,
                          opacityTo: 0.05,
                          stops: [100, 100],
                      },
                  },
            series: [
                {
                    data: [38, 60, 38, 52, 36, 40, 28],
                },
            ],
        };

        // referral
        this.referral = {
            chart: {
                height: 176,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            fill: isDark
                ? null
                : {
                      type: 'gradient',
                      gradient: {
                          type: 'vertical',
                          shadeIntensity: 1,
                          inverseColors: !1,
                          opacityFrom: 0.3,
                          opacityTo: 0.05,
                          stops: [100, 100],
                      },
                  },
            series: [
                {
                    data: [60, 28, 52, 38, 40, 36, 38],
                },
            ],
        };

        // engagement
        this.engagement = {
            chart: {
                height: 176,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#1abc9c'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: (val: any) => {
                            return '';
                        },
                    },
                },
            },
            fill: isDark
                ? null
                : {
                      type: 'gradient',
                      gradient: {
                          type: 'vertical',
                          shadeIntensity: 1,
                          inverseColors: !1,
                          opacityFrom: 0.3,
                          opacityTo: 0.05,
                          stops: [100, 100],
                      },
                  },
            series: [
                {
                    name: 'Sales',
                    data: [28, 50, 36, 60, 38, 52, 38],
                },
            ],
        };
    }
}
