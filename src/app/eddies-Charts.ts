import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import * as d3 from 'd3';
interface BottleneckData {
    date: string;
    bottlenecks: { [key: string]: number };
}

interface ParsedData {
    date: Date;
    count: number;
}
@Component({
    moduleId: module.id,
    templateUrl: './eddies-Charts.html',
    selector: 'app-eddies-charts',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class EddiesChartsComponent {
    store: any;
    private data: BottleneckData[] = [
        {
            date: '2023-07-01',
            bottlenecks: {
                'Disabled Clicks': 31,
                'Unresponsive Button': 20,
                'Form Validation Error': 22,
                'Slow Page Load': 17,
                'Broken Link': 20,
            },
        },
        {
            date: '2023-07-02',
            bottlenecks: {
                'Disabled Clicks': 35,
                'Unresponsive Button': 29,
                'Form Validation Error': 28,
                'Slow Page Load': 15,
                'Broken Link': 17,
            },
        },
        {
            date: '2023-07-03',
            bottlenecks: {
                'Disabled Clicks': 39,
                'Unresponsive Button': 28,
                'Form Validation Error': 21,
                'Slow Page Load': 18,
                'Broken Link': 12,
            },
        },
        {
            date: '2023-07-04',
            bottlenecks: {
                'Disabled Clicks': 42,
                'Unresponsive Button': 32,
                'Form Validation Error': 22,
                'Slow Page Load': 22,
                'Broken Link': 14,
            },
        },
        {
            date: '2023-07-05',
            bottlenecks: {
                'Disabled Clicks': 45,
                'Unresponsive Button': 30,
                'Form Validation Error': 25,
                'Slow Page Load': 16,
                'Broken Link': 14,
            },
        },
        {
            date: '2023-07-06',
            bottlenecks: {
                'Disabled Clicks': 48,
                'Unresponsive Button': 26,
                'Form Validation Error': 22,
                'Slow Page Load': 18,
                'Broken Link': 11,
            },
        },
        {
            date: '2023-07-07',
            bottlenecks: {
                'Disabled Clicks': 23,
                'Unresponsive Button': 20,
                'Form Validation Error': 18,
                'Slow Page Load': 16,
                'Broken Link': 14,
            },
        },
    ];
    isLoading = true;
    @ViewChild('chartContainer')
    chartContainer!: ElementRef;

    private svg: any;
    private margin = { top: 20, right: 80, bottom: 30, left: 50 };
    private width = 0;
    private height = 0;

    constructor(public storeData: Store<any>) {
        this.initStore();
        this.isLoading = false;
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
    }
    ngOnDestroy(): void {
        d3.select('svg').selectAll('*').remove();
    }

    ngAfterViewInit(): void {
        console.log(this.chartContainer.nativeElement);
        this.width = this.chartContainer.nativeElement.clientWidth - this.margin.left - this.margin.right - 200;
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.createSvg();
        this.drawChart();
    }

    private createSvg(): void {
        this.svg = d3
            .select(this.chartContainer.nativeElement)
            .append('svg')
            .attr('width', this.chartContainer.nativeElement.clientWidth)
            .attr('height', 400)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    }

    private drawChart(): void {
        console.log('test');
        const parseTime = d3.timeParse('%Y-%m-%d');

        const x = d3.scaleTime().range([0, this.width]);
        const y = d3.scaleLinear().range([this.height, 0]);
        const z = d3.scaleOrdinal(d3.schemeCategory10);

        const line = d3
            .line<ParsedData>()
            .curve(d3.curveBasis)
            .x((d) => x(d.date)!)
            .y((d) => y(d.count));

        const bottlenecks = Object.keys(this.data[0].bottlenecks).map((id) => ({
            id,
            values: this.data.map((d) => ({
                date: parseTime(d.date)!,
                count: d.bottlenecks[id],
            })),
        }));

        const xDomain = d3.extent(this.data, (d) => parseTime(d.date)!);
        if (xDomain[0] && xDomain[1]) {
            x.domain(xDomain);
        } else {
            x.domain([new Date(), new Date()]);
        }

        y.domain([d3.min(bottlenecks, (c) => d3.min(c.values, (d) => d.count))!, d3.max(bottlenecks, (c) => d3.max(c.values, (d) => d.count))!]);
        z.domain(bottlenecks.map((c) => c.id));

        this.svg.append('g').attr('class', 'axis axis--x').attr('transform', `translate(0,${this.height})`).call(d3.axisBottom(x));

        this.svg
            .append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('fill', '#000')
            .text('Count');

        const bottleneck = this.svg.selectAll('.bottleneck').data(bottlenecks).enter().append('g').attr('class', 'bottleneck');

        bottleneck
            .append('path')
            .attr('class', 'line')
            .attr('d', (d: any) => line(d.values))
            .style('stroke', (d: any) => z(d.id) as string)
            .style('fill', 'none'); // Ensure no fill inside the line curves

        bottleneck
            .append('text')
            .datum((d: any) => ({ id: d.id, value: d.values[d.values.length - 1] }))
            .attr('transform', (d: any) => `translate(${x(d.value.date)},${y(d.value.count)})`)
            .attr('x', 3)
            .attr('dy', '0.35em')
            .style('font', '10px sans-serif')
            .text((d: any) => d.id);

        const legend = this.svg
            .selectAll('.legend')
            .data(bottlenecks)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (_d: any, i: number) => `translate(0,${i * 20})`);

        legend
            .append('rect')
            .attr('x', this.width + 100)
            .attr('y', 9)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', (d: { id: string }) => z(d.id) as string);

        legend
            .append('text')
            .attr('x', this.width + 115)
            .attr('y', 14)
            .attr('dy', '.35em')
            .style('text-anchor', 'start')
            .text((d: { id: any }) => d.id);
    }
}
