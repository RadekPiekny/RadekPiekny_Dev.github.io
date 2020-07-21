import { Twister, TwisterPart, TwisterSection } from './../../models/twister.model';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IPoint } from 'src/app/models/lightning.model';

@Component({
  selector: 'twister',
  templateUrl: './twister.component.html',
  styleUrls: ['./twister.component.css']
})
export class TwisterComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  canvasWidth: number = 600;
  canvasHeight: number = 600;
  twister: Twister[] = [];

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.setupCanvas(this.canvas);
    this.twister.push(this.generateTwister());
    this.twister.forEach(t => {
      this.moveTwister(t);
    })
    
  }

  moveTwister(t: Twister) {
    let corePoints: IPoint[] = this.newTwisterCorePoints(t);
    this.changeTwisterCore(t,corePoints);
  }

  newTwisterCorePoints(t: Twister): IPoint[] {
    let newT: Twister = new Twister;
    newT.twisterSection = [];
    t.twisterSection.forEach((ts,i) => {
      newT.twisterSection.push(this.generateTwisterSection(t,i));
    })
    return this.generateTwisterPoints(newT);
  }

  changeTwisterCore(oldTwister: Twister, newCorePoints: IPoint[], i: number = 120) {
    if (i == 0) {
      return;
    }
    for (let i = 0; i < oldTwister.points.length; i++) {
      let diff = (oldTwister.points[i].x - newCorePoints[i].x) / i;
      oldTwister.points[i].x = newCorePoints[i].x + diff;
    }
    this.drawLine(oldTwister.points);
    requestAnimationFrame(() => this.changeTwisterCore(oldTwister,newCorePoints,i-1))
  }

  setupCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    let devicePixelRatio = window.devicePixelRatio;
    var rect = canvas.nativeElement.getBoundingClientRect();
    canvas.nativeElement.width = this.canvasWidth *devicePixelRatio;
    canvas.nativeElement.height = this.canvasHeight *devicePixelRatio;
    canvas.nativeElement.style.width = (this.canvasWidth).toString() + "px";
    canvas.nativeElement.style.height = (this.canvasHeight).toString() + "px";
    let canvas_context = canvas.nativeElement.getContext('2d');
    canvas_context.scale(devicePixelRatio, devicePixelRatio);
    return canvas_context;
  }

  draw() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.twister.forEach(t=> {
      //this.drawTwister(t);
      //this.moveTwister(t);
    })

    requestAnimationFrame(() => this.draw());
  }

  generateTwister(t?: Twister): Twister {
    if (t) {
      this.twister.push(t);
    } else {
      t = this.generateDefaultTwister();
    }
    t.points = this.generateTwisterPoints(t);
    return t;
  }

  generateDefaultTwister(): Twister {
    let t: Twister = new Twister;
    t.sectionCount = 4;
    t.topMaxWidth = 100;
    t.bottomMaxWidth = 40;
    t.bottomPoint = {x: 250, y: 600};
    t.sectionAngleMin = 75;
    t.sectionAngleMax = 105;
    t.sectionHeightMin = 50;
    t.sectionHeightMax = 50;

    for (let i = 0; i < t.sectionCount; i++) {
      t.twisterSection.push(this.generateTwisterSection(t,i))
    }
    return t;
  }

  generateTwisterPoints(t: Twister): IPoint[] {
    let result: IPoint[] = [];
    t.twisterSection.forEach(ts => {
      ts.points.forEach(p => {
        result.push(p);
      })
    })
    return result;
  }

  generateTwisterSection(t: Twister, i: number): TwisterSection {
    let result: TwisterSection = new TwisterSection;
    let bottom: IPoint = 
    {
      x: i == 0 ? t.bottomPoint.x : t.twisterSection[i - 1].points[t.twisterSection[i - 1].points.length - 1].x,
      y: i == 0 ? t.bottomPoint.y : t.twisterSection[i - 1].points[t.twisterSection[i - 1].points.length - 1].y
    }
    result.bottom = bottom;
    result.angle = this.getRandomIntNumber(t.sectionAngleMin,t.sectionAngleMax);
    result.height = this.getRandomIntNumber(t.sectionHeightMin,t.sectionHeightMax);
    result.yDiff = 5;
    result.points = this.generatePoints(result);
    return result;
  }

  generateDefaultTwisterPart(t: Twister,i: number): TwisterPart {
    let result: TwisterPart = new TwisterPart;
    let diff: number = (t.topMaxWidth - t.bottomMaxWidth) / t.twisterSection.length;

    result.colorStart = "rgba(0,0,0,1)";
    result.colorEnd = "rgba(255,255,255,0.6)";
    result.scaleHorizontal = 1;
    result.skewHorizontal = 0;
    result.skewVertical = 0;
    result.scaleVertical = 0.3;
    result.moveHorizontal = 0;//-1 * i * diff;
    result.moveVertical = 0;

    result.r = t.topMaxWidth - diff * i ;
    if (i > 0) {
      //result.x = t.part[i-1].x + this.getRandomIntNegativeNumber(result.tendencyLeft,result.tendencyRight);
    } else {
      //result.x = t.topStartX + this.getRandomIntNegativeNumber(result.tendencyLeft,result.tendencyRight);
    }
    //result.y = t.topStartY + i*10;

    return result;
  }

  /*moveTwister(t: Twister){
    let rnd: number = this.getRandomIntNumber(0,t.partCount);
    let rndCount: number = this.getRandomIntNumber(5,15);
    if (rnd + rndCount > t.partCount) {
      rndCount = t.partCount;
    } else {
      rndCount += rnd;
    }
    let newTendencyLeft: number = this.getRandomIntNegativeNumber(-5,5);
    t.tendencyLeft = newTendencyLeft;
    if (newTendencyLeft > 0) {
      t.tendencyRight = t.tendencyLeft - 5;
    } else {
      t.tendencyRight = t.tendencyLeft + 5;
    }
    for (let i = rnd; i < rndCount; i++) {
      t.part[i].tendencyLeft = t.tendencyLeft;
      t.part[i].tendencyRight = t.tendencyRight;
      t.part[i].x += this.getRandomIntNegativeNumber(t.tendencyLeft,t.tendencyRight);
    }
  }*/

  /*drawTwister(t: Twister) {
    t.twisterSection.forEach(p => {
      let jigg: number = this.getRandomIntNegativeNumber(-1,1);
      this.ctx.beginPath();
      let rnd: number = +this.getRandomIntNegativeNumber(-2,2);
      let grad = this.ctx.createRadialGradient(p.x,p.y,0,p.x+rnd,p.y+rnd,p.r+rnd);
      grad.addColorStop(0,p.colorStart);
      grad.addColorStop(1,p.colorEnd);
      this.ctx.fillStyle = grad;
      this.ctx.arc(p.x + jigg,p.y,p.r,0, 2 * Math.PI,false);
      this.ctx.setTransform(
        p.scaleHorizontal,
        p.skewHorizontal,
        p.skewVertical,
        p.scaleVertical*this.getRandomNumber(0.99,1),
        p.moveHorizontal,
        p.moveVertical
      );
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.filter = "none";
    })
  }*/

  generatePoints(ts: TwisterSection): IPoint[] {

    let a: number;
    let pointCount: number;
    let result: IPoint[] = [];

    switch (ts.angle) {
      case 0:
        a = 0;
        return null;
      case 180:
        a = 0;
        return null;
      default:
        a = ts.height / Math.tan(this.degrees_to_radians(ts.angle));
        break;
    }

    pointCount = ts.height / ts.yDiff;
    if (pointCount < 1) {
      return null;
    }

    ts.xdiff = a / pointCount;
    for (let i = 0; i < pointCount; i++) {
      result.push({
        x: ts.bottom.x + i * ts.xdiff,
        y: ts.bottom.y - i * ts.yDiff
      })
    }
    return result;
    //this.drawLine(ts);
  }

  drawLine(points: IPoint[]) {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.moveTo(points[0].x,points[0].y);
    this.ctx.beginPath();
    points.forEach(p => {
      this.ctx.lineTo(p.x,p.y)
    });
    this.ctx.closePath();
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
  }

  degrees_to_radians(degrees: number): number {
    return degrees * (Math.PI/180);
  }

  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  getRandomIntNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  getRandomIntNegativeNumber(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
  }


}
