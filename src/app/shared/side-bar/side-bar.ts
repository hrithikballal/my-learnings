import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.scss'],
})
export class SidebarComponent {}
