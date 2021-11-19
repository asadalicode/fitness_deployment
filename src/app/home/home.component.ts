import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { QuoteService } from './quote.service';
import { DataService } from '../@shared/services/data.service';
import { FormGroup } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { MultiDataSet, Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { DashboardUsers } from '@app/@shared/Models/DashboardUsers';
import { DashboardPayments } from '@app/@shared/Models/DashboardPayments';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [style({ opacity: 0 }), stagger(100, [animate('0.5s', style({ opacity: 1 }))])], {
          optional: true,
        }),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  @ViewChild('mycanvas')
  canvas: ElementRef;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  // Doughnut
  public doughnutChartLabels: Label[] = ['Female', 'Male'];
  public doughnutChartLabelsStatus: Label[] = ['Inactive', 'Active'];
  public doughnutChartPaymentLabels: Label[] = ['Payment', 'Payment'];
  public doughnutChartEarningLabels: Label[] = ['Earnings', 'Earnings'];
  public earningChartData: MultiDataSet = [];
  public userChartData: MultiDataSet = [];
  public paymentChartData: MultiDataSet = [];
  public coachChartData: MultiDataSet = [];
  public genderChartData: MultiDataSet = [];
  public statusChartData: MultiDataSet = [];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartColors = [{ backgroundColor: ['#0D1111', '#BFBFBF'] }];

  public doughnutChartOptions = {
    responsive: true,
    // aspectRatio: 2.5,
    cutoutPercentage: 60,
    legend: {
      display: false,
    },
  };

  page = 1;
  isDisabled = true;
  collectionSize = 0;

  pageSize = 5;
  pageCount = 0;
  quote: string | undefined;
  isLoading: boolean = false;
  model: any;
  earningsData: any = {};
  subscriptionData: any = {};
  options: {
    circumference: number;
    rotation: number;
    animation: { onComplete: () => void };
  };

  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [
    {
      afterDraw(chart: any) {
        const ctx = chart.ctx;
        var txt1 = '';
        var txt2 = '';

        try {
          var check = chart.active ? chart.tooltip._active[0]._datasetIndex : 'None';
          if (check !== 'None') {
            txt1 = chart.tooltip._data.labels[chart.tooltip._active[0]._index];
            txt2 = chart.tooltip._data.datasets[0].data[chart.tooltip._active[0]._index];
          } else {
            txt1 = chart.tooltip._data.labels[0];
            txt2 = chart.tooltip._data.datasets[0].data[0];
          }
        } catch (err) {
          txt1 = chart.tooltip._data.labels[0];
          txt2 = chart.tooltip._data.datasets[0].data[0];
        }
        //Get options from the center object in options
        const sidePadding = 60;
        const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding

        const stringWidth = ctx.measureText(txt1).width;
        const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        const widthRatio = elementWidth / stringWidth;
        const newFontSize = Math.floor(30 * widthRatio);
        const elementHeight = chart.innerRadius * 2;

        // Pick a new font size so it will not be larger than the height of label.
        const fontSizeToUse = 15;
        ctx.font = fontSizeToUse + 'px Arial';
        ctx.fillStyle = 'black';

        // Draw text in center
        ctx.fillText('total', centerX, centerY - 20);
        var fontSizeToUse1 = 30;
        ctx.font = fontSizeToUse1 + 'px Arial';
        let data = chart.tooltip._data.datasets[0].data[0] + chart.tooltip._data.datasets[0].data[1];

        ctx.fillText(data, centerX, centerY + 10);
      },
    },
  ];
  public doughnutChartPaymentPlugins: PluginServiceGlobalRegistrationAndOptions[] = [
    {
      afterDraw(chart: any) {
        const ctx = chart.ctx;
        var txt1 = '';
        var txt2 = '';

        try {
          var check = chart.active ? chart.tooltip._active[0]._datasetIndex : 'None';
          if (check !== 'None') {
            txt1 = chart.tooltip._data.labels[chart.tooltip._active[0]._index];
            txt2 = chart.tooltip._data.datasets[0].data[chart.tooltip._active[0]._index];
          } else {
            txt1 = chart.tooltip._data.labels[0];
            txt2 = chart.tooltip._data.datasets[0].data[0];
          }
        } catch (err) {
          txt1 = chart.tooltip._data.labels[0];
          txt2 = chart.tooltip._data.datasets[0].data[0];
        }
        //Get options from the center object in options
        const sidePadding = 60;
        const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding

        const stringWidth = ctx.measureText(txt1).width;
        const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        const widthRatio = elementWidth / stringWidth;
        const newFontSize = Math.floor(30 * widthRatio);
        const elementHeight = chart.innerRadius * 2;

        // Pick a new font size so it will not be larger than the height of label.
        const fontSizeToUse = 15;
        ctx.font = fontSizeToUse + 'px Arial';
        ctx.fillStyle = 'black';

        // Draw text in center
        ctx.fillText('total', centerX, centerY - 20);
        var fontSizeToUse1 = 30;
        ctx.font = fontSizeToUse1 + 'px Arial';
        let data = chart.tooltip._data.datasets[0].data[0] + chart.tooltip._data.datasets[0].data[1];

        ctx.fillText('$' + data, centerX, centerY + 10);
      },
    },
  ];

  public doughnutChartEarningPlugins: PluginServiceGlobalRegistrationAndOptions[] = [
    {
      afterDraw(chart: any) {
        const ctx = chart.ctx;
        var txt1 = '';
        var txt2 = '';

        try {
          var check = chart.active ? chart.tooltip._active[0]._datasetIndex : 'None';
          if (check !== 'None') {
            txt1 = chart.tooltip._data.labels[chart.tooltip._active[0]._index];
            txt2 = chart.tooltip._data.datasets[0].data[chart.tooltip._active[0]._index];
          } else {
            txt1 = chart.tooltip._data.labels[0];
            txt2 = chart.tooltip._data.datasets[0].data[0];
          }
        } catch (err) {
          txt1 = chart.tooltip._data.labels[0];
          txt2 = chart.tooltip._data.datasets[0].data[0];
        }
        //Get options from the center object in options
        const sidePadding = 60;
        const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding

        const stringWidth = ctx.measureText(txt1).width;
        const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        const widthRatio = elementWidth / stringWidth;
        const newFontSize = Math.floor(30 * widthRatio);
        const elementHeight = chart.innerRadius * 2;

        // Pick a new font size so it will not be larger than the height of label.
        const fontSizeToUse = 15;
        ctx.font = fontSizeToUse + 'px Arial';
        ctx.fillStyle = 'black';

        // Draw text in center
        let today = moment().format('DD MMM');
        ctx.fillText(today, centerX, centerY - 20);
        var fontSizeToUse1 = 30;
        ctx.font = fontSizeToUse1 + 'px Arial';
        let data = chart.tooltip._data.datasets[0].data[0] + chart.tooltip._data.datasets[0].data[1];

        ctx.fillText('$' + data, centerX, centerY + 10);
      },
    },
  ];

  constructor(private quoteService: QuoteService, private dataService: DataService, private media: MediaObserver) {}

  ngOnInit() {
    this.model = new FormControl('');
    this.getTotalUsers();
    this.getAllSubscriptions();
    this.getCardsData(30);
    this.dataService.filters.isToday = false;
    this.getSubscriptionData();
  }

  checkDate() {}
  get isMobile(): boolean {
    return this.media.isActive('sm');
  }
  get smallDevice(): boolean {
    return this.media.isActive('xs');
  }
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins: any = [];

  barChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Subscription Purchase Graph',
    },
  ];
  isToday: boolean = false;
  public barChartColors = [{ backgroundColor: '#0D1111' }];
  selectedDays: any = 30;
  seeToday() {
    this.isToday = !this.isToday;
    this.dataService.filters.isToday = this.isToday;
    this.getSubscriptionData();
  }

  selectedMenu(val: any) {
    this.selectedDays = val;
    this.getCardsData(this.selectedDays);
  }

  getSubscriptionData() {
    this.isLoading = true;
    this.dataService.filters.limit = 5000;

    this.barChartData[0].data = [];
    this.barChartLabels = [];
    this.dataService.getForTesting(`/dashboard/earnings`).subscribe(
      (res: any) => {
        this.subscriptionData = res.data.purchases;
        this.pageCount = this.subscriptionData.count;
        this.dataService.filters.limit = 5;
        let data: any = res.data.purchases;
        if (data.graph_data.length) {
          data.graph_data.forEach((elem: any) => {
            this.barChartLabels.push(elem.date);
            this.barChartData[0].data.push(elem.count);
          });
        } else {
          this.pageCount = 1;
        }

        this.isLoading = false;
      },
      (error: any) => {
        this.dataService.filters.limit = 5;
        this.isLoading = false;
      }
    );
  }

  getCardsData(days: any) {
    this.dataService.getHeaderCards(`/dashboard/dashboard_data?days=${days}`).subscribe(
      (res: any) => {
        this.earningsData = res.data;
        this.paymentChartData = [
          [this.earningsData?.payments_received == 0 ? 1 : this.earningsData?.payments_received, 0],
        ];
        this.earningChartData = [[this.earningsData?.earnings_today == 0 ? 1 : this.earningsData?.earnings_today, 0]];
      },
      (error) => {
        this.paymentChartData = [[1, 1]];
        this.earningChartData = [[1, 1]];
      }
    );
  }

  getTotalUsers() {
    this.dataService.getSingle('/dashboard/get_users_count', DashboardUsers).subscribe(
      (res: any) => {
        this.userChartData.push(res[0]?.users?.Female, res[0]?.users?.Male);
        this.coachChartData.push(res[0]?.coaches?.Female, res[0]?.coaches?.Male);
      },
      (error) => {
        this.userChartData = [[1, 1]];
        this.coachChartData = [[1, 1]];
      }
    );
  }

  getAllSubscriptions() {
    this.dataService.getSingle('/dashboard/get_subscribers_count', DashboardPayments).subscribe(
      (res: any) => {
        this.genderChartData.push(res[0]?.gender?.Female, res[0]?.gender?.Male);
        this.statusChartData.push(res[0]?.status?.Expired, res[0]?.status?.Active);
      },
      (error) => {
        this.genderChartData = [[1, 1]];
        this.statusChartData = [[1, 1]];
      }
    );
  }

  setPage(e: any) {
    this.dataService.filters.offset = e - 1;
    this.dataService.filters.isToday = false;
    this.getSubscriptionData();
  }
}
