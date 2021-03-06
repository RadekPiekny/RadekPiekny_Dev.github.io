import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ILightning, ILine } from 'src/app/models/lightning.model';
import { Subject, of } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { delay, take, tap } from 'rxjs/operators';
import { IPoint } from 'src/app/models/graphic-general.model';

@Component({
  selector: 'lightning-canvas',
  templateUrl: './lightning-canvas.component.html',
  styleUrls: ['./lightning-canvas.component.css']
})
export class LightningCanvasComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  canvasWidth = 500;
  canvasHeight = 500;

  lightningID = 0;

  fps$: Subject<number> = new Subject<number>();
  fps: number;
  frameTime: number;
  lightnings: ILightning[] = [];
  paintFrame: number;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.setupCanvas(this.canvas);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.fps$.next(this.calcFPS());
    this.fps$.pipe(take(1)).subscribe(f => {
      this.fps = f;
      this.frameTime = 1000 / f;
      console.log('framerate of this monitor is: ' + f + 'hz')
    });
  }

  setupCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    const devicePixelRatio = window.devicePixelRatio;
    const rect = canvas.nativeElement.getBoundingClientRect();
    canvas.nativeElement.width = this.canvasWidth * devicePixelRatio;
    canvas.nativeElement.height = this.canvasWidth * devicePixelRatio;
    canvas.nativeElement.style.width = (this.canvasWidth).toString() + 'px';
    canvas.nativeElement.style.height = (this.canvasWidth).toString() + 'px';
    const canvasContext = canvas.nativeElement.getContext('2d');
    canvasContext.scale(devicePixelRatio, devicePixelRatio);
    return canvasContext;
  }

  canvasPaint(i: number = 0) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.clear(this.lightnings);
    for (const l of this.lightnings) {
      this.drawLightningNew(l);
    }
    requestAnimationFrame(() => this.canvasPaint(i++));
  }

  canvasPaintOnce() {
    for (const lg of this.lightnings) {
      this.drawLightningGlowPart(lg);
    }
    for (const lp of this.lightnings) {
      this.drawLightningPart(lp);
    }
    requestAnimationFrame(() => this.canvasPaintOnce());
  }

  clear(l: ILightning[]) {
    l.forEach((lightning, i) => {
      if (lightning.id === -1) {
        this.lightnings.splice(i, 1);
        this.clear(this.lightnings);
      }
    });
  }

  thunderStorm() {
    for (let index = 0; index < 6; index++) {
      this.generateNewLightning();
    }
  }

  drawLightningPart(l: ILightning) {

    const currentLastLinePaint: number = l.lastLinePaint + l.cyclePerFrame;
    if (currentLastLinePaint >= l.line.length - 1) {
      l.lastLinePaint = l.line.length - 1;
    }
    this.ctx.filter = 'none';
    this.ctx.strokeStyle = 'rgba(255,255,255,1)';
    this.ctx.lineCap = 'round';
    for (let i = l.lastLinePaint; i < currentLastLinePaint; i++) {
      this.ctx.moveTo(l.line[i].p1.x, l.line[i].p1.y);
      this.ctx.lineTo(l.line[i].p2.x, l.line[i].p2.y);
      this.ctx.lineWidth = l.line[i].width;
    }
    this.ctx.stroke();
  }

  drawLightningGlowPart(l: ILightning) {
    const currentLastLinePaint: number = l.lastLinePaint + l.cyclePerFrame;
    if (currentLastLinePaint >= l.line.length - 1) {
      l.lastLinePaint = l.line.length - 1;
    }
    const grad = this.ctx.createLinearGradient(
      l.pointOrigin.x, l.pointOrigin.y, l.line[l.lastLinePaint].p2.x, l.line[l.lastLinePaint].p2.y
    );
    grad.addColorStop(0, 'rgba(0,0,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,1)');

    for (let i = l.lastLinePaint; i < currentLastLinePaint; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(l.line[i].p1.x, l.line[i].p1.y);
      this.ctx.lineTo(l.line[i].p2.x, l.line[i].p2.y);
      this.ctx.lineWidth = l.line[i].width * 12;
      this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      //  this.ctx.filter = "blur(5px)"; //performance issues hardcore
    }
    this.ctx.stroke();
    l.lastLinePaint = currentLastLinePaint;
  }

  drawLightningNew(l: ILightning) {
    this.ctx.filter = 'none';
    this.ctx.strokeStyle = 'rgba(255,255,255,1)';
    this.ctx.lineCap = 'round';

    const currentLastLinePaint: number = l.lastLinePaint + l.cyclePerFrame;
    if (currentLastLinePaint >= l.line.length - 1) {
      l.lastLinePaint = l.line.length - 1;
      if (Date.now() - l.startTime > l.duration) {
        l.id = -1;
        return;
      }
    }
    this.drawLightningGlow(l);

    this.ctx.filter = 'none';
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
    const grad = this.ctx.createLinearGradient(
      l.pointOrigin.x, l.pointOrigin.y, l.line[l.lastLinePaint].p2.x, l.line[l.lastLinePaint].p2.y
    );
    grad.addColorStop(0, 'rgba(200,200,255,0.15)');
    grad.addColorStop(1, 'rgba(255,255,255,0.15)');

    for (let i = 0; i < l.lastLinePaint; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(l.line[i].p1.x, l.line[i].p1.y);
      this.ctx.lineTo(l.line[i].p2.x, l.line[i].p2.y);
      this.ctx.lineWidth = l.line[i].width * 8;
      this.ctx.strokeStyle = grad;
      this.ctx.stroke();
      this.ctx.filter = 'blur(5px)'; // performance issues hardcore
    }
    this.ctx.closePath();
  }

  getRandomIntNegativeNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
    const animationDurationVal: number = this.getRandomInt(60, 180);

    const l: ILightning = {
      id: this.lightningID++,
      widthStart: 3,
      widthEnd: 0.3,
      pointOrigin: {x: this.getRandomArbitrary(20, 60), y: 0},
      tendencyHorizontal: {left: -3, right: 6},
      tendencyVertical: {top: 1, bottom: 8},
      lineCount: this.getRandomInt(60, 60),
      line: null,
      animationDuration: animationDurationVal,
      lastLinePaint: 0,
      lightningChain: null,
      channelAnimation: true,
      duration: animationDurationVal + 5000,
      cyclePerFrame: null,
      startTime: Date.now()
    };

    l.line = this.generateLinesLightning(l);
    const framesCount: number = l.animationDuration / this.frameTime;
    const cyclePerFrame: number = Math.ceil(l.line.length / framesCount);
    l.cyclePerFrame = cyclePerFrame;

    return l;
  }

  generateLinesLightning(l: ILightning): ILine[] {
    const result: ILine[] = [];
    let lastPoint: IPoint = l.pointOrigin;
    for (let i = 0; i < l.lineCount; i++) {
      const widthgg = l.widthStart - (l.widthStart - l.widthEnd) / l.lineCount * i;
      const line: ILine = {
        p1: {
          x: lastPoint.x,
          y: lastPoint.y
        },
        p2: {
          x: lastPoint.x + this.getRandomArbitrary(l.tendencyHorizontal.left, l.tendencyHorizontal.right),
          y: lastPoint.y + this.getRandomArbitrary(l.tendencyVertical.top, l.tendencyVertical.bottom),
        },
        width: widthgg
      };
      line.width = widthgg;

      result.push(line);
      lastPoint = line.p2;
    }

    return result;
  }

  getRandomArbitrary(min: number, max: number) {
    let rnd: number = Math.random() * (max - min) + min;
    rnd = parseFloat(rnd.toFixed(2));
    return rnd;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  calcFPS(lastFrameTime: number = 0, frameDuration: number = 0, frameCount: number = 10): number{
    const currentFrameTime: number = Date.now();
    if (lastFrameTime !== 0) {
      const currentFrameDuration = (currentFrameTime - lastFrameTime);
      frameDuration = (currentFrameDuration + frameDuration) / 2;
    }
    if (frameCount <= 0) {
      let result = 1000 / frameDuration;
      result = this.roundNearestTenth(result);
      this.fps$.next(result);
      return result;
    }

    frameCount--;
    requestAnimationFrame(() => this.calcFPS(currentFrameTime, frameDuration, frameCount));
  }

  roundNearestTenth(n: number) {
    const rest: number = n % 10;
    if (rest < 5) {
      return Math.floor(n / 10) * 10;
    }
    return Math.floor(n / 10) * 10 + 10;
  }
}
