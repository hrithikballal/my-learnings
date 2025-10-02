import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './features/dashboard/dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent, HttpClientModule],
  template: `<app-dashboard></app-dashboard>`,
})
export class App {}
