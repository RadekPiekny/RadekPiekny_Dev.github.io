import { Twister, TwisterPart, TwisterSection } from './../../models/twister.model';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
    this.generateLine();
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
      this.drawTwister(t);
      this.moveTwister(t);
    })

    requestAnimationFrame(() => this.draw());
  }

  generateTwister(t?: Twister) {
    if (t) {
      this.twister.push(t);
    }
    this.twister.push(this.generateDefaultTwister());
  }

  generateDefaultTwister(): Twister {
    let t: Twister = new Twister;
    t.partCount = 120;
    t.topMaxWidth = 100;
    t.bottomMaxWidth = 40;
    t.topStartX = 250;
    t.topStartY = 150;
    t.tendencyLeft = -3;
    t.tendencyRight = 6;
    for (let i = 0; i < t.partCount; i++) {
      t.part.push(this.generateDefaultTwisterPart(t,i))
    }
    //t.part.reverse();
    return t;
  }

  generateDefaultTwisterPart(t: Twister,i: number): TwisterPart {
    let result: TwisterPart = new TwisterPart;
    let diff: number = (t.topMaxWidth - t.bottomMaxWidth) / t.partCount;

    result.colorStart = "rgba(0,0,0,1)";
    result.colorEnd = "rgba(255,255,255,0.6)";
    result.scaleHorizontal = 1;
    result.skewHorizontal = 0;
    result.skewVertical = 0;
    result.scaleVertical = 0.3;
    result.moveHorizontal = 0;//-1 * i * diff;
    result.moveVertical = 0;

    if (Math.random() > 0.9) {
      t.tendencyLeft = this.getRandomIntNegativeNumber(-5,5);
      t.tendencyRight = t.tendencyLeft + 5;
    }
    result.tendencyLeft = t.tendencyLeft;
    result.tendencyRight = t.tendencyRight;

    result.r = t.topMaxWidth - diff * i ;
    if (i > 0) {
      result.x = t.part[i-1].x + this.getRandomIntNegativeNumber(result.tendencyLeft,result.tendencyRight);
    } else {
      result.x = t.topStartX + this.getRandomIntNegativeNumber(result.tendencyLeft,result.tendencyRight);
    }
    result.y = t.topStartY + i*10;

    return result;
  }

  moveTwister(t: Twister){
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
  }

  drawTwister(t: Twister) {
    t.part.forEach(p => {
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
  }

  generateLine(n: number = 30) {
    let ts: TwisterSection = new TwisterSection;
    ts.angle = 182;
    ts.points = [];
    ts.bottom = {x: 300, y: 400};
    ts.yDiff = 10;
    let b: number = ts.yDiff * n;
    let c: number = b / Math.tan(this.degrees_to_radians(ts.angle));
    console.log(c);
    ts.xdiff = c / n;
    for (let i = 0; i < n; i++) {
      ts.points.push({
        x: ts.bottom.x + i * ts.xdiff,
        y: ts.bottom.y - i * ts.yDiff
      })
    }

    this.drawLine(ts);
  }

  drawLine(ts: TwisterSection) {
    this.ctx.moveTo(ts.points[0].x,ts.points[0].y);
    this.ctx.beginPath();
    ts.points.forEach(p => {
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