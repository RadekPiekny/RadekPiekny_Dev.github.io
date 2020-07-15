import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ILightning, ILine, IPoint } from 'src/app/models/lightning.model';
import { Subject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'lightning-canvas',
  templateUrl: './lightning-canvas.component.html',
  styleUrls: ['./lightning-canvas.component.css']
})
export class LightningCanvasComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  canvasWidth: number = 300;
  canvasHeight: number = 300;

  lightningID: number = 0;

  fps$: Subject<number> = new Subject<number>();
  fps: number;
  frameTime: number;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.setupCanvas(this.canvas);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.fps$.next(this.calcFPS());
    this.fps$.subscribe(f => {
      this.fps = f;
      this.frameTime = 1000 / f;
      console.log("framerate of this monitor is: " + f + 'hz')
    })
  }

  setupCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    let devicePixelRatio = window.devicePixelRatio;
    var rect = this.canvas.nativeElement.getBoundingClientRect();
    canvas.nativeElement.width = this.canvasWidth *devicePixelRatio;
    canvas.nativeElement.height = this.canvasWidth *devicePixelRatio;
    canvas.nativeElement.style.width = (this.canvasWidth).toString() + "px";
    canvas.nativeElement.style.height = (this.canvasWidth).toString() + "px";
    let canvas_context = this.canvas.nativeElement.getContext('2d');
    canvas_context.scale(devicePixelRatio, devicePixelRatio);
    return canvas_context;
  }

  resetToDefault() {

  }

  thunderStorm() {
    for (let index = 0; index < 20; index++) {
      setTimeout(() => {
        this.drawNewLightning();
      }, this.getRandomInt(16,3600));
    }
  }

  drawLightning(l: ILightning, lastLineIndex: number = 0) {
    this.ctx.beginPath();
    this.ctx.moveTo(l.line[lastLineIndex].p2.x, l.line[lastLineIndex].p2.y);
    this.ctx.strokeStyle = "rgba(255,255,255,1)";

    this.ctx.lineTo(l.line[lastLineIndex + 1].p2.x, l.line[lastLineIndex + 1].p2.y);
    this.ctx.lineWidth = l.line[lastLineIndex + 1].width;
    this.ctx.lineCap = "round";
    this.ctx.stroke();
    this.ctx.closePath();
    this.drawShadow((l.line[lastLineIndex + 1].p1.x+l.line[lastLineIndex + 1].p2.x)/2,(l.line[lastLineIndex + 1].p1.y+l.line[lastLineIndex + 1].p2.y)/2,l.line[lastLineIndex + 1].width*8);

    if (lastLineIndex == l.line.length - 2) {
      return;
    }
    lastLineIndex++;

    let framesCount: number = l.animationDuration / this.frameTime;
    let cyclePerFrame: number = Math.ceil(l.line.length / framesCount);
    if (lastLineIndex % cyclePerFrame == 0) {
      requestAnimationFrame(() => this.drawLightning(l,lastLineIndex));
    } else {
      this.drawLightning(l,lastLineIndex);
    }
  }

  drawNewLightning(l?: ILightning) {
    this.resetToDefault();
    this.drawLightning(l ? l : this.generateDefaultLightning());
  }

  drawShadow(x: number, y: number, r: number) {

    let grad = this.ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0,"rgba(255,255,255,0.1)");
    grad.addColorStop(1,"rgba(255,255,255,0)");
    this.ctx.fillStyle = grad;
    this.ctx.arc(x,y,r,0, 2 * Math.PI);
    this.ctx.fill();
    //this.ctx.closePath();
    this.ctx.filter = "none";
  }

  getRandomIntNegativeNumber(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
  }

  generateNewLightning(l?: ILightning, parentID?: number) {
    if (!l) {
      l = this.generateDefaultLightning();
    }
  }

  generateDefaultLightning(): ILightning {
    let l: ILightning = {
      id: this.lightningID++,
      widthStart: 3,
      widthEnd: 0.3,
      pointOrigin: {x: this.getRandomArbitrary(0,300), y: 0},
      tendencyHorizontal: {left: -3, right: 6},
      tendencyVertical: {top: 5, bottom: 5},
      lineCount: this.getRandomInt(15,60),
      line: null,
      animationDuration: this.getRandomInt(150,300),
      lightningChain: null
    };
    l.line = this.generateLinesLightning(l);

    return l;
  }

  generateLinesLightning(l: ILightning): ILine[] {
    let result: ILine[] = [];
    let lastPoint: IPoint = l.pointOrigin;
    for (let i = 0; i < l.lineCount; i++) {
      let width = l.widthStart - (l.widthStart - l.widthEnd) / l.lineCount * i;
      let line: ILine = {
        p1: {
          x: lastPoint.x,
          y: lastPoint.y
        },
        p2: {
          x: lastPoint.x + this.getRandomArbitrary(l.tendencyHorizontal.left,l.tendencyHorizontal.right),
          y: lastPoint.y + this.getRandomArbitrary(l.tendencyVertical.top,l.tendencyVertical.bottom),
        },
        width: width
      };
      line.width = width;

      result.push(line);
      lastPoint = line.p2;
    }

    return result;
  }

  getRandomArbitrary(min: number, max: number) {
    let rnd: number = Math.random() * (max - min) + min;
    rnd.toFixed(2);
    return rnd;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  calcFPS(lastFrameTime: number = 0, frameDuration: number = 0, frameCount: number = 10): number{
    let currentFrameTime: number = Date.now();
    if (lastFrameTime !== 0) {
      let currentFrameDuration = (currentFrameTime - lastFrameTime);
      frameDuration = (currentFrameDuration + frameDuration) / 2;
    }
    
    if (frameCount <= 0) {
      let result = 1000 / frameDuration;
      result = this.roundNearestTenth(result);
      this.fps$.next(result);
      return result;
    }

    frameCount--;
    requestAnimationFrame(() => this.calcFPS(currentFrameTime,frameDuration,frameCount));
  }

  roundNearestTenth(n: number) {
    let rest: number = n % 10;
    if (rest < 5) {
      return Math.floor(n/10) * 10;
    }
    return Math.floor(n/10) * 10 + 10;
  }
}
