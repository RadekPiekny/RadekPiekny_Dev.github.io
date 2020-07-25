import { AppSettingsService } from './services/appSettings.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  colorScheme: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(
    public appSettingsService: AppSettingsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.appSettingsService.darkMode$.next(this.colorScheme.matches);
    this.appSettingsService.MainBGColor$.next(getComputedStyle(document.body).getPropertyValue('--Main-BG-Color'));
    this.colorScheme.addListener(val => {
      this.appSettingsService.darkMode$.next(val.matches);
      this.cdr.detectChanges();
    })
  }

}

