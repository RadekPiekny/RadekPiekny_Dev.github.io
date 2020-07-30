import { AppSettingsService } from './services/appSettings.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { stringify } from 'querystring';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  colorScheme: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  @ViewChild('whatever') whatever: ElementRef;

  constructor(
    public appSettingsService: AppSettingsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.appSettingsService.darkMode$.next(this.colorScheme.matches);
    this.appSettingsService.MainBGColor$.next(null);
    
    this.colorScheme.addListener(val => {
      this.appSettingsService.darkMode$.next(val.matches);
      this.cdr.detectChanges();
    })
    this.generateShades();
  }
  
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log(getComputedStyle(this.whatever.nativeElement as HTMLDivElement)['background-color'])
  }

  generateColor(i): string {
    let shade: number = i == 0 ? 0 : i*16-1;
    return`--Color-Grey-${shade}: rgba(${shade},${shade},${shade},1);\n`
  }

  generateShades() {
    let result: string;
    for (let i = 0; i < 17; i++) {
      result += this.generateColor(i)
    }
    console.log(result);
  }
}

