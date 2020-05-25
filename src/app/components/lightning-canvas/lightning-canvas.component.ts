import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-lightning-canvas',
  templateUrl: './lightning-canvas.component.html',
  styleUrls: ['./lightning-canvas.component.css']
})
export class LightningCanvasComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;

  constructor() { }

  ngOnInit(): void {
    this.setupCanvas(this.canvas);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  setupCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    let devicePixelRatio = window.devicePixelRatio || 1;
    var rect = this.canvas.nativeElement.getBoundingClientRect();
    canvas.nativeElement.width = rect.width * devicePixelRatio;
    canvas.nativeElement.height = rect.height * devicePixelRatio;
    this.canvasWidth = canvas.nativeElement.width;
    this.canvasHeight = canvas.nativeElement.height;
    let canvas_context = this.canvas.nativeElement.getContext('2d');
    canvas_context.scale(devicePixelRatio, devicePixelRatio);
    return canvas_context;
  }

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

}
