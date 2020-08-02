import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() value: number = 0.33; // 0-1
  @Input() width: number = 100;
  @Input() strokeWidth: number = 0.03 * this.width;
  @Input() animate: boolean = true;
  @Input() lineCap: string = "round";

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
    this.strokeDashArray = `0 ${this.circumference}`
    setTimeout(() => {
      this.strokeDashArray = `calc(${this.value} * ${this.circumference}) ${this.circumference}`;
    });
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

  circlePath(cx: number = 10, cy: number = 10, r: number = 10){
    return 'M '+cx+' '+cy+' m -'+r+', 0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0';
  }

}
