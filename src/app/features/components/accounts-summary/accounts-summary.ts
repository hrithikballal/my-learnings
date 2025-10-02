import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-accounts-summary',
  templateUrl: './accounts-summary.html',
  styleUrls: ['./accounts-summary.scss'],
  imports: [CommonModule, BaseChartDirective],
  standalone: true,
})
export class AccountsSummaryComponent {
  totalAccounts = 13;
  accounts = [
    { label: 'Closed credit cards', count: 4, color: '#9370DB' },
    { label: 'Closed loans', count: 1, color: '#FFD700' },
    { label: 'Open credit cards', count: 2, color: '#ADD8E6' },
    { label: 'Open loans', count: 6, color: '#3CB371' },
  ];

  totalDisputes = 12;
  totalEnquiries = 5;
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartData: ChartData<'doughnut'> = {
    labels: this.accounts.map((a) => a.label),
    datasets: [
      {
        data: this.accounts.map((a) => a.count),
        backgroundColor: this.accounts.map((a) => a.color),
        hoverBackgroundColor: this.accounts.map((a) => a.color),
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
}
