import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as shape from 'd3-shape';
@Component({
    moduleId: module.id,
    templateUrl: './user-journey.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class UserJourneyComponent implements OnInit {
    curve = shape.curveBundle;
    store: any;
    revenueChart: any;
    salesByCategory: any;
    dailySales: any;
    totalOrders: any;
    isLoading = true;
    basic1: FlatpickrOptions = {};
    basic2: FlatpickrOptions = {};
    form1!: FormGroup;
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
    chartOptions = ['Flowchart', 'Sankey'];
    selectedChart = 'Flowchart';
    links = [
        {
            id: 'a',
            source: 'landing',
            target: 'deals',
            label: '100 sessions',
        },
        {
            id: 'n',
            source: 'deals',
            target: 'device-detail',
            label: '98 sessions',
        },
        {
            id: 'b',
            source: 'landing',
            target: 'phones-devices',
            label: '100 sessions',
        },
        {
            id: 'c',
            source: 'landing',
            target: 'device-detail',
            label: '150 sessions',
        },

        {
            id: 'd',
            source: 'phones-devices',
            target: 'device-detail',
            label: '100 sessions',
        },
        {
            id: 'e',
            source: 'landing',
            target: 'wireless',
            label: '303 sessions',
        },
        {
            id: 'f',
            source: 'phones-devices',
            target: 'byod',
            label: '760 sessions',
        },
        {
            id: 'g',
            source: 'wireless',
            target: 'byod-learn',
            label: '289 sessions',
        },
        {
            id: 'h',
            source: 'byod-learn',
            target: 'byod',
            label: '273 sessions',
        },
        {
            id: 'i',
            source: 'device-detail',
            target: 'plan-config',
            label: '96 sessions',
        },
        {
            id: 'j',
            source: 'plan-config',
            target: 'config-accessories',
            label: '94 sessions',
        },
        {
            id: 'k',
            source: 'byod',
            target: 'byod-identify',
            label: '720 sessions',
        },
        {
            id: 'l',
            source: 'byod-identify',
            target: 'byod-sim',
            label: '670 sessions',
        },
        {
            id: 'm',
            source: 'byod-sim',
            target: 'byod-planconfig',
            label: '620 sessions',
        },
        {
            id: 'o',
            source: 'byod-planconfig',
            target: 'byod-config-accessories',
            label: '94 sessions',
        },
        {
            id: 'p',
            source: 'config-accessories',
            target: 'shopping-cart',
            label: '94 sessions',
        },
        {
            id: 'q',
            source: 'byod-config-accessories',
            target: 'shopping-cart',
            label: '94 sessions',
        },
        {
            id: 'r',
            source: 'shopping-cart',
            target: 'checkout',
            label: '90 sessions',
        },
        {
            id: 's',
            source: 'checkout',
            target: 'thank-you',
            label: '88 sessions',
        },
    ];
    nodes = [
        {
            id: 'landing',
            label: 'Landing Page',
            data: { count: 10 },
        },
        {
            id: 'deals',
            label: 'Deals',
            data: { count: 2 },
        },
        {
            id: 'phones-devices',
            label: 'Phones & Devices',
            data: { count: 2 },
        },
        {
            id: 'device-detail',
            label: 'Device Detail',
            data: { count: 1 },
        },
        {
            id: 'wireless',
            label: 'Wireless',
            data: { count: 5 },
        },
        {
            id: 'byod-learn',
            label: 'BYOD Learn',
            data: { count: 3 },
        },
        {
            id: 'byod',
            label: 'BYOD',
            data: { count: 4 },
        },
        {
            id: 'plan-config',
            label: 'Plan Config',
            data: { count: 3 },
        },
        {
            id: 'config-accessories',
            label: 'Config & Accessories',
            data: { count: 2 },
        },
        {
            id: 'byod-identify',
            label: 'BYOD Identify',
            data: { count: 6 },
        },
        {
            id: 'byod-sim',
            label: 'BYOD SIM',
            data: { count: 5 },
        },
        {
            id: 'byod-planconfig',
            label: 'BYOD Plan Config',
            data: { count: 4 },
        },
        {
            id: 'byod-config-accessories',
            label: 'BYOD Config & Accessories',
            data: { count: 2 },
        },
        {
            id: 'shopping-cart',
            label: 'Shopping Cart',
            data: { count: 1 },
        },
        {
            id: 'checkout',
            label: 'Checkout',
            data: { count: 0 },
        },
        {
            id: 'thank-you',
            label: 'Thank You',
            data: { count: 0 },
        },
    ];
    // curve = shape.curveBundle;
    constructor(public storeData: Store<any>, public fb: FormBuilder) {
        this.initStore();
        this.isLoading = false;
    }
    ngOnInit(): void {
        // this.options = ['All', 'https://www.att.com/', 'https://www.att.com/deals/'];
        // this.selectedPage = 'All';
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

    initCharts() {
        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;

        // revenue
        this.revenueChart = {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196f3', '#e7515a'] : ['#1b55e2', '#e7515a'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1b55e2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#e7515a',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
            series: [
                {
                    name: 'Income',
                    data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
                },
                {
                    name: 'Expenses',
                    data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
                },
            ],
        };

        // sales by category
        this.salesByCategory = {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Apparel', 'Sports', 'Others'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
            series: [985, 737, 270],
        };

        // daily sales
        this.dailySales = {
            chart: {
                height: 160,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
                stacked: true,
                stackType: '100%',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#e2a03f', '#e0e6ed'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                labels: {
                    show: false,
                },
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            },
            yaxis: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                },
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 10,
                    right: -20,
                    bottom: -20,
                    left: -20,
                },
            },
            series: [
                {
                    name: 'Sales',
                    data: [44, 55, 41, 67, 22, 43, 21],
                },
                {
                    name: 'Last Week',
                    data: [13, 23, 20, 8, 13, 27, 33],
                },
            ],
        };

        // total orders
        this.totalOrders = {
            chart: {
                height: 290,
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
            colors: isDark ? ['#00ab55'] : ['#00ab55'],
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 125,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
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
            tooltip: {
                x: {
                    show: false,
                },
            },
            series: [
                {
                    name: 'Sales',
                    data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40],
                },
            ],
        };
    }
}
