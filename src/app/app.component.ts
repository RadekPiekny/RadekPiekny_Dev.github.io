import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  colorScheme: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  darkMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.colorScheme.matches);
  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.colorScheme.addListener(val => {
      this.darkMode$.next(val.matches);
      this.cdr.detectChanges();
    })
  }

}

