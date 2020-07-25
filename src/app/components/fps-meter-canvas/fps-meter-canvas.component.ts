import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { IPoint } from 'src/app/models/graphic-general.model';

@Component({
  selector: 'fps-meter-canvas',
  templateUrl: './fps-meter-canvas.component.html',
  styleUrls: ['./fps-meter-canvas.component.css']
})
export class FpsMeterCanvasComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  fps$: Subject<number> = new Subject<number>();
  frameTime: number;
  frequency: number;
  running: boolean = false;
  deviation: number = 1.1;
  fps: number;
  frameCountforAvarageCalc: number = 10; // how many frames for calculation of avarage
  frameTimeStorage: number[] = [];
  visualizer: IPoint[] = [];
  getViewBox: string;
  textHeight: number = 30;
  lineHeight: number = 70;
  dividers: Idivider[] = [];
  pointCount: number = 100;
  horizontalDiff: number;
  @Input() height: number = 100;
  @Input() width: number = 200;

  canvasWidth: number;
  canvasHeight: number;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.canvasHeight = this.height - 19;
    this.canvasWidth = this.width;
    this.horizontalDiff = this.canvasWidth / this.pointCount;
    this.ctx = this.setupCanvas(this.canvas);

    this.fps$.next(this.calcFPS());
    this.fps$.subscribe(f => {
      this.frequency = f;
      this.frameTime = 16;//1000 / f;
    })
    for (let i = 0; i < 6; i++) {
      this.dividers.push({y: Math.floor(100/6 * i)})
    }
  }

  setupCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    let devicePixelRatio = window.devicePixelRatio;
    canvas.nativeElement.width = this.canvasWidth *devicePixelRatio;
    canvas.nativeElement.height = this.canvasHeight *devicePixelRatio;
    canvas.nativeElement.style.width = (this.canvasWidth).toString() + "px";
    canvas.nativeElement.style.height = (this.canvasHeight).toString() + "px";
    let canvas_context = canvas.nativeElement.getContext('2d');
    canvas_context.scale(devicePixelRatio, devicePixelRatio);
    return canvas_context;
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

  run() {
    this.running = !this.running;
    let lastFrameTime: number = Date.now()
    requestAnimationFrame(() => this.measureFPS(lastFrameTime))
  }

  measureFPS(lastFrameTime: number) {
    if (!this.running) {
      return;
    }
    let currentFrameTime: number = Date.now();
    let diff: number = currentFrameTime - lastFrameTime;
    /*if (this.frameTime * this.deviation > diff) {
      diff =this.frameTime;
    }*/
    let a = this.frameTime/diff;
    this.frameTimeStorage.push(Math.floor(1000 / diff));

    if (this.frameTimeStorage.length > this.frameCountforAvarageCalc) {
      this.fps = Math.ceil(this.frameTimeStorage.reduce((total, item, _, { length }) => {
        return total + item / length;
      }, 0));
      this.frameTimeStorage = [];
    }
    this.cdr.detectChanges();

    this.visualizer.push({ x: this.horizontalDiff * this.visualizer.length, y: this.canvasHeight - this.canvasHeight * a});
    if (this.visualizer.length > this.pointCount) {
      this.visualizer.map(p => p.x -= this.horizontalDiff);
      this.visualizer.shift();
    }
    this.drawLine();
    requestAnimationFrame(() => this.measureFPS(currentFrameTime));
  }

  drawLine() {
    this.ctx.fillStyle = "transparent";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.beginPath();
    this.ctx.moveTo(this.visualizer[0].x,this.visualizer[0].y);
    this.visualizer.forEach(p => {
      this.ctx.lineTo(p.x,p.y);
    })
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "rgba(0,0,0,0.3)";
    this.ctx.stroke();
  }

  roundNearestTenth(n: number) {
    let rest: number = n % 10;
    if (rest < 5) {
      return Math.floor(n/10) * 10;
    }
    return Math.floor(n/10) * 10 + 10;
  }

}

interface Idivider {
  y: number;
}