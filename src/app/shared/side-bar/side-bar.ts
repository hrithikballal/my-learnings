import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatBadgeModule],
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.scss'],
})
export class SidebarComponent {}
