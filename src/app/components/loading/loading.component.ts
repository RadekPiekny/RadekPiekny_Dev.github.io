import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input() params: LoadingComponentParams;
  completeURL = window.location.href;
  constructor() { }

  ngOnInit() {
    if (!this.params) {
      let ff: LoadingComponentParams;
      this.params = {
        size: 84,
        innerRingColor: "rgba(53, 39, 204, 0.248)",
        middleRingColor: "rgba(59, 45, 181, 0.3)",
        outerRingColor: "rgba(62, 63, 163, 0.3)",
        text: "loading",
        textInside: false,
        textPulse: false
      }
    }
  }
  getTextClass(): string {
    let multiClass: string = '';
    if (this.params.textPulse) {
      multiClass += ' pulse'
    }
    if (this.params.textInside) {
      multiClass += ' textInside'
    }
    return multiClass
  }

}

interface LoadingComponentParams {
  size: number;
  innerRingColor: string;
  middleRingColor: string;
  outerRingColor: string;
  text: string;
  textInside: boolean;
  textPulse: boolean;
}