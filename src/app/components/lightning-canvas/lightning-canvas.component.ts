import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ILightning, ILine, IPoint } from 'src/app/models/lightning.model';
import { Subject, of } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'lightning-canvas',
  templateUrl: './lightning-canvas.component.html',
  styleUrls: ['./lightning-canvas.component.css']
})
export class LightningCanvasComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  canvasWidth: number = 500;
  canvasHeight: number = 500;

  lightningID: number = 0;

  fps$: Subject<number> = new Subject<number>();
  fps: number;
  frameTime: number;
  lightnings: ILightning[] = [];
  paintFrame: number;

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
    var rect = canvas.nativeElement.getBoundingClientRect();
    canvas.nativeElement.width = this.canvasWidth *devicePixelRatio;
    canvas.nativeElement.height = this.canvasWidth *devicePixelRatio;
    canvas.nativeElement.style.width = (this.canvasWidth).toString() + "px";
    canvas.nativeElement.style.height = (this.canvasWidth).toString() + "px";
    let canvas_context = canvas.nativeElement.getContext('2d');
    canvas_context.scale(devicePixelRatio, devicePixelRatio);
    return canvas_context;
  }

  canvasPaint(frameTime?: number, i: number = 0) {
    let currentFrameTime: number = Date.now();
    this.paintFrame = currentFrameTime - frameTime;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.clear(this.lightnings);
    for (let i = 0; i < this.lightnings.length; i++) {
      this.drawLightningNew(this.lightnings[i]);
    }
    requestAnimationFrame(() => this.canvasPaint(currentFrameTime,i++));
  }

  canvasPaintOnce() {

    for (let i = 0; i < this.lightnings.length; i++) {
      this.drawLightningGlowPart(this.lightnings[i]);
    }
    for (let i = 0; i < this.lightnings.length; i++) {
      this.drawLightningPart(this.lightnings[i]);
    }
    
    requestAnimationFrame(() => this.canvasPaintOnce());
  }

  clear(l: ILightning[]) {
    l.forEach((l,i) => {
      if (l.id == -1) {
        this.lightnings.splice(i,1);
        this.clear(this.lightnings);
      }
    });
  }

  thunderStorm() {
    for (let index = 0; index < 1; index++) {
      this.generateNewLightning();
    }
  }

  drawLightningPart(l: ILightning) {

    let currentLastLinePaint: number = l.lastLinePaint + l.cyclePerFrame;
    if (currentLastLinePaint >= l.line.length - 1) {
      l.lastLinePaint = l.line.length - 1;
    } 

    this.ctx.filter = "none"
    this.ctx.strokeStyle = "rgba(255,255,255,1)";
    this.ctx.lineCap = "round";
    for (let i = l.lastLinePaint; i < currentLastLinePaint; i++) {
      this.ctx.moveTo(l.line[i].p1.x, l.line[i].p1.y);
      this.ctx.lineTo(l.line[i].p2.x, l.line[i].p2.y);
      this.ctx.lineWidth = l.line[i].width;
    }
    this.ctx.stroke();
  }

  drawLightningGlowPart(l: ILightning) {
    let currentLastLinePaint: number = l.lastLinePaint + l.cyclePerFrame;
    if (currentLastLinePaint >= l.line.length - 1) {
      l.lastLinePaint = l.line.length - 1;
    } 
    let grad = this.ctx.createLinearGradient(l.pointOrigin.x, l.pointOrigin.y,l.line[l.lastLinePaint].p2.x,l.line[l.lastLinePaint].p2.y);
    grad.addColorStop(0,"rgba(0,0,255,1)");
    grad.addColorStop(1,"rgba(255,255,255,1)");    

    for (let i = l.lastLinePaint; i < currentLastLinePaint; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(l.line[i].p1.x, l.line[i].p1.y);
      this.ctx.lineTo(l.line[i].p2.x, l.line[i].p2.y);
      this.ctx.lineWidth = l.line[i].width*12;
      this.ctx.strokeStyle = "rgba(255,255,255,0.3)";
      
      //this.ctx.filter = "blur(5px)"; //performance issues hardcore
    }
    this.ctx.stroke();
    l.lastLinePaint = currentLastLinePaint;
  }

  drawLightningNew(l: ILightning) {
    this.ctx.filter = "none"
    
    this.ctx.strokeStyle = "rgba(255,255,255,1)";
    this.ctx.lineCap = "round";

    let currentLastLinePaint: number = l.lastLinePaint + l.cyclePerFrame;
    if (currentLastLinePaint >= l.line.length - 1) {
      l.lastLinePaint = l.line.length - 1;
      if (Date.now() - l.startTime > l.duration) {
        l.id = -1;
        return;
      }
    } 
    this.drawLightningGlow(l);

    this.ctx.filter = "none"
    this.ctx.beginPath();
    for (let i = 0; i < l.lastLinePaint; i++) {
      
      this.ctx.moveTo(l.line[i].p1.x, l.line[i].p1.y);
      this.ctx.lineTo(l.line[i].p2.x, l.line[i].p2.y);
      this.ctx.lineWidth = l.line[i].width;
      this.ctx.stroke();
    }
    this.ctx.closePath();
    l.lastLinePaint = currentLastLinePaint;
  }

  drawLightningGlow(l: ILightning) {
    if (l === undefined) {
      return;
    }
    let grad = this.ctx.createLinearGradient(l.pointOrigin.x, l.pointOrigin.y,l.line[l.lastLinePaint].p2.x,l.line[l.lastLinePaint].p2.y);
    grad.addColorStop(0,"rgba(200,200,255,0.15)");
    grad.addColorStop(1,"rgba(255,255,255,0.15)");    

    for (let i = 0; i < l.lastLinePaint; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(l.line[i].p1.x, l.line[i].p1.y);
      this.ctx.lineTo(l.line[i].p2.x, l.line[i].p2.y);
      this.ctx.lineWidth = l.line[i].width*8;
      this.ctx.strokeStyle = grad;
      this.ctx.stroke();
      
      this.ctx.filter = "blur(5px)"; //performance issues hardcore
    }
    this.ctx.closePath();
  }

  getRandomIntNegativeNumber(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
  }

  generateNewLightning(l?: ILightning, parentID?: number) {
    if (!l) {
      l = this.generateDefaultLightning();
    }
    this.lightnings.push(l);
    /*setTimeout(() => {
      this.lightnings.splice(this.lightnings.findIndex(lightning => lightning.id == l.id),1);
    }, l.duration);*/
  }

  generateDefaultLightning(): ILightning {
    let _animationDuration: number = this.getRandomInt(60,180);

    let l: ILightning = {
      id: this.lightningID++,
      widthStart: 3,
      widthEnd: 0.3,
      pointOrigin: {x: this.getRandomArbitrary(20,60), y: 0},
      tendencyHorizontal: {left: -3, right: 6},
      tendencyVertical: {top: 1, bottom: 8},
      lineCount: this.getRandomInt(60,60),
      line: null,
      animationDuration: _animationDuration,
      lastLinePaint: 0,
      lightningChain: null,
      channelAnimation: true,
      duration: _animationDuration + 5000,
      cyclePerFrame: null,
      startTime: Date.now()
    };

    l.line = this.generateLinesLightning(l);
    let framesCount: number = l.animationDuration / this.frameTime;
    let cyclePerFrame: number = Math.ceil(l.line.length / framesCount);
    l.cyclePerFrame = cyclePerFrame;

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
