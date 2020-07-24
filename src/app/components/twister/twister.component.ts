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
  animate: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.setupCanvas(this.canvas);
    this.twister.push(this.generateTwister());
    this.twister.push(this.generateTwister());
    this.twister.push(this.generateTwister());
    this.twister.push(this.generateTwister());
    this.runAnimation();
  }

  runAnimation () {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.twister.forEach(t => {
      this.moveTwister(t);
    })
    if (this.animate) {
      requestAnimationFrame(() => this.runAnimation());
    }
  }

  moveTwister(t: Twister) {
    if (t.changeProgress > t.changeDuration) {
      t.changeProgress = 0;
      let corePoints: IPoint[] = this.newTwisterCorePoints(t);
      t.changePointsDiff = this.changeTwisterCore(t,corePoints);
    }
    this.twist(t);
  }

  newTwisterCorePoints(t: Twister): IPoint[] {
    let newT: Twister = this.generateTwister();
    return this.generateTwisterPoints(newT);
  }

  changeTwisterCore(oldTwister: Twister, newCorePoints: IPoint[]):number[] {
    let diff: number[] = [];
    for (let i = 0; i < oldTwister.points.length; i++) {
      diff.push((oldTwister.points[i].x - newCorePoints[i].x)/oldTwister.changeDuration)
    }
    return diff;
  }

  twist(t: Twister) {
    t.changeProgress += 1; 
    t.points.forEach((p,i) => {
      p.x -= t.changePointsDiff[i];
    })
    
    t.circles = this.generateTwisterCircles(t);
    this.drawTwister(t);
    this.drawLine(t.points,"rgba(255,0,0,0.1)");
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

  generateTwister(t?: Twister): Twister {
    if (t) {
      this.twister.push(t);
    } else {
      t = this.generateDefaultTwister();
    }
    t.points = this.generateTwisterPoints(t);
    t.circles = this.generateTwisterCircles(t);
    return t;
  }

  generateDefaultTwister(): Twister {
    let t: Twister = new Twister;
    t.sectionCount = 4;
    t.topMaxWidth = 100;
    t.bottomMaxWidth = 33;
    t.bottomPoint = {x: this.getRandomIntNumber(150,450), y: 500};
    t.sectionAngleMin = 45;
    t.sectionAngleMax = 135;
    t.sectionHeightMin = 50;
    t.sectionHeightMax = 50;
    t.changeDuration = 180;
    t.changeProgress = 181;

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

  generateTwisterCircles(t: Twister): TwisterPart[] {
    let diff: number = (t.topMaxWidth - t.bottomMaxWidth) / t.points.length;
    let result: TwisterPart[] = [];
    t.points.forEach((p,i) => {
      let tp: TwisterPart = new TwisterPart;
      tp.x = p.x;
      tp.y = p.y;
      tp.r = t.bottomMaxWidth + i * diff;
      tp.colorStart = "rgba(0,0,0,1)";
      tp.colorEnd = `rgba(255,255,255,1)`;
      tp.scaleHorizontal = 1;
      tp.skewHorizontal = 0;
      tp.skewVertical = 0;
      tp.scaleVertical = 0.3;
      tp.moveHorizontal = 0;
      tp.moveVertical = 0;
      result.push(tp);
    })
    return result;
  }

  drawTwister(t: Twister) {
    this.resetTransform();
    t.circles.forEach(c => {
      this.drawCircle(c);
    })
    this.drawTopTwister(t);
  }

  drawTopTwister(t: Twister) {
    this.ctx.save();
    let circlesFromTop: TwisterPart[];
    circlesFromTop = t.circles.reverse();
    
    this.drawCircle(circlesFromTop[0]);
    this.ctx.clip();

    circlesFromTop.forEach(c => {
      this.drawCircle(c,1);
    })
    this.ctx.restore();
    //

  }

  drawCircle(c: TwisterPart,rRatio: number = 1) {
    this.ctx.beginPath();
    let jigg: number = 0;//this.getRandomIntNegativeNumber(-1,1);
    let rnd: number = this.getRandomIntNegativeNumber(-2,2);
    let grad = this.ctx.createRadialGradient(c.x,c.y/ c.scaleVertical,0,c.x,c.y / c.scaleVertical,c.r);
    grad.addColorStop(0,c.colorStart);
    grad.addColorStop(1,c.colorEnd);
    this.ctx.fillStyle = grad;
    
    this.ctx.setTransform(
      c.scaleHorizontal,
      c.skewHorizontal,
      c.skewVertical,
      c.scaleVertical * this.getRandomNumber(0.99,1),
      c.moveHorizontal,
      c.moveVertical
    );
    this.ctx.arc(c.x,c.y / c.scaleVertical,c.r * rRatio,0, 2 * Math.PI,false);
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(255,255,255,0.3)";
    this.ctx.stroke();
    this.resetTransform();
    this.ctx.closePath();
    this.ctx.filter = "none";
  }

  drawCircleStroke(c: TwisterPart,rRatio: number = 1,lineWidth: number = 1) {
    this.ctx.beginPath();    
    this.ctx.setTransform(
      c.scaleHorizontal,
      c.skewHorizontal,
      c.skewVertical,
      c.scaleVertical *this.getRandomNumber(0.99,1),
      c.moveHorizontal,
      c.moveVertical
    );
    this.ctx.arc(c.x,c.y / c.scaleVertical,c.r * rRatio,0, 2 * Math.PI,false);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = "rgba(255,0,0,1)";
    this.ctx.stroke();
    this.resetTransform();
    this.ctx.closePath();
    this.ctx.filter = "none";
  }

  resetTransform() {
    this.ctx.setTransform(1,0,0,1,0,0);
  }

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

  drawLine(points: IPoint[], color: string) {
    this.ctx.moveTo(points[0].x,points[0].y);
    this.ctx.beginPath();
    points.forEach(p => {
      this.ctx.lineTo(p.x,p.y)
    });
    //this.ctx.closePath();
    this.ctx.strokeStyle = color;
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
