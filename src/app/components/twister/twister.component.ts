import { Twister, TwisterPart } from './../../models/twister.model';
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
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.twister.forEach(t=> {
      this.drawTwister(t);
      this.moveTwister();
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
    t.tendencyLeft = -3;
    t.tendencyRight = 6;
    t.partCount = 60;
    t.topMaxWidth = 100;
    t.bottomMaxWidth = 5;
    t.topStartX = 250;
    t.topStartY = 150;
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
    result.moveHorizontal = -1 * i * diff;
    result.moveVertical = 0;
    result.r = t.topMaxWidth - diff * i ;
    result.x = t.topStartX + this.getRandomIntNegativeNumber(t.tendencyLeft,t.tendencyRight) - diff * i;
    result.y = t.topStartY + i*10;

    return result;
  }

  moveTwister(){
    this.twister.forEach(t=> {
      t.movingJig = this.getRandomIntNumber(-2,2);
      t.part.forEach(p => {
        p.x += 1 + t.movingJig;
      })
    })
  }

  drawTwister(t: Twister) {
    t.part.forEach(p => {
      this.ctx.beginPath();
      let grad = this.ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      grad.addColorStop(0,p.colorStart);
      grad.addColorStop(1,p.colorEnd);
      this.ctx.fillStyle = grad;
      this.ctx.arc(p.x,p.y,p.r,0, 2 * Math.PI,false);
      this.ctx.setTransform(
        p.scaleHorizontal,
        p.skewHorizontal,
        p.skewVertical,
        p.scaleVertical,
        p.moveHorizontal,
        p.moveVertical
      );
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.filter = "none";
    })
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