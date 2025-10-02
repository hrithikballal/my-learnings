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

// Data point for the Chart.js chart (x is month index, y is score, r is radius for bubble effect)
interface ChartDataPoint {
  x: number;
  y: number;
  r: number;
  label?: string; // Optional label for the bubble
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
  // --- Data Signals ---
  // Data for the Score History Log (Right Panel)
  scoreHistory = signal<ScoreUpdate[]>([
    { score: 493, date: '18/08/2022', trend: 'up', change: 43 },
    { score: 490, date: '16/08/2022', trend: 'down', change: 20 },
    { score: 510, date: '14/08/2022', trend: 'up', change: 1 },
    { score: 509, date: '12/08/2022', trend: 'new', change: null }, // Initial entry is often N/H
    { score: 505, date: '10/07/2022', trend: 'down', change: 10 },
    { score: 515, date: '25/06/2022', trend: 'up', change: 22 },
    { score: 493, date: '01/06/2022', trend: 'down', change: 87 },
    { score: 580, date: '05/05/2022', trend: 'up', change: 60 },
    { score: 520, date: '01/04/2022', trend: 'up', change: 20 },
    { score: 500, date: '01/03/2022', trend: 'new', change: null },
  ]);

  // Data for Chart.js (Points mapped to month index 0=JAN, 11=DEC)
  // Current data points are:
  // MAR (2) is missing
  // APR (3) -> 520
  // MAY (4) -> 580
  // JUN (5) -> 493
  // JUL (6) is missing
  // AUG (7) -> 510
  chartData = signal<ChartDataPoint[]>([
    { x: 3, y: 520, r: 8, label: '520' }, // APR
    { x: 4, y: 580, r: 8, label: '580' }, // MAY
    { x: 5, y: 493, r: 8, label: '493' }, // JUN
    { x: 7, y: 510, r: 8, label: '510' }, // AUG
  ]);

  // Computed signal for the active month label based on the latest history entry
  activeMonthLabel = computed(() => {
    const latestDate = this.scoreHistory()[0]?.date;
    if (latestDate) {
      // Simple logic to get Month/Year for the title (e.g., 18/08/2022 -> August 2022)
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

  // --- Methods ---
  ngOnInit(): void {
    // We use setTimeout to ensure the canvas element is fully rendered before Chart.js tries to find it.
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

    // Chart.js uses the global 'Chart' object imported via CDN
    // @ts-ignore
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded.');
      return;
    }

    // @ts-ignore
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'NB Score',
            // Data must be mapped to use {x, y} format for linear scales
            data: this.chartData(),
            borderColor: '#007bff', // Bootstrap Primary Blue
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            fill: false,
            tension: 0, // Straight lines
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#007bff', // Blue dots
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
            // Enable standard tooltip (was disabled before)
            enabled: true,
            mode: 'index',
            intersect: false,
            // Custom callback to display the score label in the tooltip
            callbacks: {
              label: (context: any) => {
                const index = context.dataIndex;
                const dataPoint = this.chartData()[index]; // Use the index of the chartData array
                return dataPoint
                  ? `Score: ${dataPoint.label} +`
                  : `Score: ${context.formattedValue}`;
              },
              title: (context: any) => {
                // Display the month name by mapping the X value back to the label array
                // @ts-ignore
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
            // FIX 1: Change scale type to 'linear' to use the 'x' values from the data points
            type: 'linear',
            min: 0,
            max: 11,
            grid: {
              display: false,
            },
            ticks: {
              stepSize: 1, // Draw a tick for every month index
              color: '#343a40',
              // FIX 2: Manually map the numerical index back to the month label
              callback: function (value, index, values) {
                const numValue = Number(value); // <--- FIX APPLIED HERE: Convert value to number
                // Check if the tick value is an integer (i.e., corresponds to a month index)
                if (Number.isInteger(numValue) && numValue >= 0 && numValue < labels.length) {
                  return labels[numValue];
                }
                return ''; // Hide ticks between the months if stepSize was smaller
              },
            },
            border: {
              color: '#ccc',
            },
          },
        },
        // Removed customScoreBubbles plugin to simplify the code.
      },
    });
  }
}
