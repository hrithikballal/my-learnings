import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/side-bar/side-bar';
import { TopbarComponent } from '../../shared/top-bar/top-bar';
import { ScoreHistoryComponent } from '../components/score-history/score-history';
import { DataService } from '../../services/data.service';
import { GaugeChartComponent } from '../components/gauge-chart/gauge-chart';
import { AccountsSummaryComponent } from '../components/accounts-summary/accounts-summary';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SidebarComponent,
    TopbarComponent,
    ScoreHistoryComponent,
    GaugeChartComponent,
    AccountsSummaryComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  constructor(public ds: DataService) {}
}
