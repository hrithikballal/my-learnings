import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { MockData } from '../models';

@Injectable({ providedIn: 'root' })
export class DataService {
  url = 'assets/mock-data.json';
  data$!: Observable<MockData>;

  constructor(public http: HttpClient) {
    this.data$ = this.http.get<MockData>(this.url).pipe(shareReplay(1));
  }
}
