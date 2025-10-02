import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, MatMenuModule],
  templateUrl: './top-bar.html',
  styleUrls: ['./top-bar.scss'],
})
export class TopbarComponent {
  @Input() title = 'Dashboard';
  languages = ['English', 'Spanish', 'French', 'German'];
  selectedLanguage = this.languages[0];

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
  }
}
