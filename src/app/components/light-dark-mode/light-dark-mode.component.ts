import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'light-dark-mode',
  templateUrl: './light-dark-mode.component.html',
  styleUrls: ['./light-dark-mode.component.css']
})
export class LightDarkModeComponent {
  @Input() darkMode: boolean = false;
  @Output() darkModeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() darkModeColor: string = 'rgb(40,40,40)';
  @Input() lightModeColor: string = 'rgb(255,255,255)';

  completeURL: string;
  dayNightChangeCount: number = 0;

  constructor() {
    this.completeURL = window.location.href;
  }
  
  ngOnChanges(changes: SimpleChanges) {
    //this.doSomething(changes.darkMode.currentValue);
    if (changes.darkMode) {
      this.dayNightChangeCount++;
    }
  }

  changeMode() {
    this.darkMode = !this.darkMode;
    this.darkModeChange.emit(this.darkMode);
  }

}