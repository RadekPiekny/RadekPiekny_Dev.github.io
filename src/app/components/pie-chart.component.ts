import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() value: number = 0.33; // 0-1
  @Input() width: number = 100;
  @Input() strokeWidth: number = 0.2 * this.width;

  strokeWidthViewBox: number; // 20 is is viewBox as X
  r: number;
  circumference: number;
  strokeDashArray: string;
  contentStyle: Object;

  constructor() { }

  ngOnInit(): void {
    this.strokeWidthViewBox = this.strokeWidth / this.width * 20; // 20 is is viewBox as X
    this.r = (20 - this.strokeWidthViewBox) / 2;
    this.circumference = 2 * Math.PI * this.r;
    this.strokeDashArray = `calc(${this.value} * ${this.circumference}) ${this.circumference}`;
    //const c: number = this.pythagorasCalculateC(this.width, this.width);
    const contentPosition: string = Math.floor(this.width / 4) + 'px';
    this.contentStyle = {
      top: contentPosition,
      bottom: contentPosition,
      left: contentPosition,
      right: contentPosition
    }
  }

  pythagorasCalculateC(a,b): number{
    return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
  }

}
