import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'fps-meter',
  templateUrl: './fps-meter.component.html',
  styleUrls: ['./fps-meter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FpsMeterComponent implements OnInit {
  fps$: Subject<number> = new Subject<number>();
  frameTime: number;
  frequency: number;
  running: boolean = false;
  deviation: number = 1.1;
  fps: number;
  frameCountforAvarageCalc: number = 10; // how many frames for calculation of avarage
  frameTimeStorage: number[] = [];
  visualizer: Ibar[] = [];
  getViewBox: string;
  textHeight: number = 30;
  lineHeight: number = 70;
  dividers: Idivider[] = [];
  @Input() height: number = 50;
  @Input() width: number = 48;
  @Input() barCount: number;
  @ViewChild('svg') svg : ElementRef;
  polyline: string;
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.barCount = this.width;
    this.fps$.next(this.calcFPS());
    this.fps$.subscribe(f => {
      this.frequency = f;
      this.frameTime = 16;//1000 / f;
    })
    for (let i = 0; i < 6; i++) {
      this.dividers.push({y: Math.floor(100/6 * i)})
    }
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

    this.visualizer.push({ "height": a > 1 ? 1 : a});
    if (this.visualizer.length > this.barCount) {
      this.visualizer.shift();
    }
    this.polyline = this.getPolyline(this.visualizer);
    
    requestAnimationFrame(() => this.measureFPS(currentFrameTime));
  }
  run() {
    this.running = !this.running;
    let lastFrameTime: number = Date.now()
    requestAnimationFrame(() => this.measureFPS(lastFrameTime))
  }

  getBarStyle(bar: Ibar) {
    return {
      height: bar.height + '%',
      backgroundColor: `rgba(${255 -(255 * bar.height / 100)},${255 * bar.height / 100},0,1)`
    }
  }

  getPolyline(bars: Ibar[]): string {
    let result: string = "";
    for (let i = 0; i < bars.length; i++) {
      result += ` ${this.width / (this.height - 19) * 100 / bars.length * i} ${100-100*bars[i].height}`
    }
    return result;
  }

}

interface Ibar {
  height: number;
}

interface Idivider {
  y: number;
}