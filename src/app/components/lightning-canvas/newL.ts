import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
  initialX: number;
  initialY: number;
  newX: number;
  newY: number;

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.setupCanvas(this.canvas);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.resetToDefault();
    this.drawLightning(0);
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
    this.initialY = 0;
    this.initialX = 100;

    this.newX = this.initialX;
    this.newY = this.initialY;
  }

  drawLightning(i: number = 0) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 3 - i*0.1;
    this.ctx.strokeStyle = "rgba(255,255,255,1)";
    this.ctx.moveTo(this.initialX,this.initialY);

    this.newX = this.initialX + this.getRandomIntNegativeNumber(-10,10);
    this.newY = i*10;

    this.ctx.lineTo(this.newX, this.newY);
    this.ctx.stroke();
    this.ctx.closePath()
    this.drawShadow((this.initialX+this.newX)/2,(this.initialY+this.newY)/2,this.ctx.lineWidth*10);
    this.initialX = this.newX;
    this.initialY = this.newY;
    if (i>33) {
      return;
    }
    this.newX = this.initialX;
    this.newY = this.initialY;
    requestAnimationFrame(() => this.drawLightning(i+1));
  }

  drawNewLightning() {
    this.resetToDefault();
    this.drawLightning();
  }

  drawShadow(x: number, y: number, r: number) {

    let grad = this.ctx.createRadialGradient(x,y,0,x,y,r);
    grad.addColorStop(0,"rgba(255,255,255,0.2)");
    grad.addColorStop(1,"rgba(255,255,255,0)");
    this.ctx.fillStyle = grad;
    this.ctx.arc(x,y,r,0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.filter = "none";
  }

  drawLine() {
    this.ctx.moveTo(20,0);
    this.ctx.fillStyle = 'red';
    this.ctx.lineWidth = 10;
    this.ctx.shadowColor = "rgba(255,0,0,1)";
    this.ctx.shadowBlur = 5;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.lineTo(30, 300);
    this.ctx.stroke();
  }

  getRandomIntNegativeNumber(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
  }

}
