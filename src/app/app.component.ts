import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  darkMode: boolean;
  constructor() { }

  ngOnInit() {
  }


  changeMode(darkMode: boolean) {
    this.darkMode = darkMode;
  }

  getTheme(): string {
    if (this.darkMode) {
      return 'dark';
    }
    return 'light';
  }

}

