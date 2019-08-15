import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'light-dark-mode',
  templateUrl: './light-dark-mode.component.html',
  styleUrls: ['./light-dark-mode.component.css']
})
export class LightDarkModeComponent implements OnInit {

  @Input() darkMode: boolean = false;
  @Output() _darkMode: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() darkModeColor: string = 'rgb(40,40,40)';
  @Input() lightModeColor: string = 'rgb(255,255,255)';

  completeURL: string;
  changes: number = 0;

  constructor() {
    let host = window.location.href;
    this.completeURL = host;
  }

  ngOnInit() {
  }

  changeMode() {
    this.changes = this.changes + 1;
    this.darkMode = !this.darkMode;
    this._darkMode.emit(this.darkMode);
  }

}