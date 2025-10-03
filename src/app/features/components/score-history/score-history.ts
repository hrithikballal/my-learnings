import { ChangeDetectionStrategy, Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js';

interface ScoreUpdate {
  score: number;
  date: string;
  trend: 'up' | 'down' | 'new';
  change: number | null;
}

interface ChartDataPoint {
  x: number;
  y: number;
  r: number;
  label?: string;
}

@Component({
  selector: 'app-score-history',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './score-history.html',
  styleUrls: ['./score-history.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreHistoryComponent implements OnInit {
  scoreHistory = signal<ScoreUpdate[]>([
    { score: 493, date: '18/08/2022', trend: 'up', change: 43 },
    { score: 490, date: '16/08/2022', trend: 'down', change: 20 },
    { score: 510, date: '14/08/2022', trend: 'up', change: 1 },
    { score: 509, date: '12/08/2022', trend: 'new', change: null },
    { score: 505, date: '10/07/2022', trend: 'down', change: 10 },
    { score: 515, date: '25/06/2022', trend: 'up', change: 22 },
    { score: 493, date: '01/06/2022', trend: 'down', change: 87 },
    { score: 580, date: '05/05/2022', trend: 'up', change: 60 },
    { score: 520, date: '01/04/2022', trend: 'up', change: 20 },
    { score: 500, date: '01/03/2022', trend: 'new', change: null },
  ]);

  chartData = signal<ChartDataPoint[]>([
    { x: 3, y: 520, r: 8, label: '520' },
    { x: 4, y: 580, r: 8, label: '580' },
    { x: 5, y: 493, r: 8, label: '493' },
    { x: 7, y: 510, r: 8, label: '510' },
  ]);

  activeMonthLabel = computed(() => {
    const latestDate = this.scoreHistory()[0]?.date;
    if (latestDate) {
      const parts = latestDate.split('/');
      const monthIndex = parseInt(parts[1], 10) - 1;
      const year = parts[2];
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      return `${monthNames[monthIndex]} ${year}`;
    }
    return 'Score History';
  });

  ngOnInit(): void {
    setTimeout(() => {
      this.renderChart();
    }, 0);
  }

  getTrendClass(trend: 'up' | 'down' | 'new'): string {
    if (trend === 'up') return 'up-arrow text-success';
    if (trend === 'down') return 'down-arrow text-danger';
    return 'new-arrow text-info';
  }

  getTrendTextClass(trend: 'up' | 'down' | 'new'): string {
    if (trend === 'up') return 'score-up fw-semibold';
    if (trend === 'down') return 'score-down fw-semibold';
    if (trend === 'new') return 'score-new text-muted';
    return '';
  }

  renderChart(): void {
    const canvas = document.getElementById('scoreChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element #scoreChart not found.');
      return;
    }

    const labels = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded.');
      return;
    }
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'NB Score',
            data: this.chartData(),
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            fill: false,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#007bff',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context: any) => {
                const index = context.dataIndex;
                const dataPoint = this.chartData()[index];
                return dataPoint
                  ? `Score: ${dataPoint.label} +`
                  : `Score: ${context.formattedValue}`;
              },
              title: (context: any) => {
                const xValue = context[0].parsed.x;
                return labels[xValue];
              },
            },
          },
        },
        scales: {
          y: {
            min: 300,
            max: 900,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              stepSize: 100,
              color: '#343a40',
            },
            border: {
              color: '#ccc',
            },
          },
          x: {
            type: 'linear',
            min: 0,
            max: 11,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              stepSize: 1,
              color: '#343a40',
              callback: function (value) {
                const numValue = Number(value);
                if (Number.isInteger(numValue) && numValue >= 0 && numValue < labels.length) {
                  return labels[numValue];
                }
                return '';
              },
            },
            border: {
              color: '#ccc',
            },
          },
        },
      },
    });
  }
}
