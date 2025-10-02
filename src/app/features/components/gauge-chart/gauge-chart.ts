import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-gauge-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './gauge-chart.html',
  styleUrls: ['./gauge-chart.scss'],
})
export class GaugeChartComponent {
  gaugeValue = 767;
  minValue = 300;
  maxValue = 900;
  get percentage(): number {
    return (this.gaugeValue - this.minValue) / (this.maxValue - this.minValue);
  }

  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Low', 'Medium', 'High', 'Excellent'],
    datasets: [
      {
        data: [300, 100, 100, 100, 100],
        backgroundColor: ['#E15825', '#F18200', '#FCD800', '#A9D161', '#009900'],
        borderWidth: 5,
      },
    ],
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '85%',
    circumference: 180,
    rotation: 270,
    animation: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };
}
