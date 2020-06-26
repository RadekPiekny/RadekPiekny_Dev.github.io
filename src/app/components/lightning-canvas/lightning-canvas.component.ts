import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lightning-canvas',
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
    this.ctx = this.setupCanvas(this.canvas);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.draw();
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
    let initialX: number = 150;
    let initialY: number = 0;
    let newX: number = 150;
    let newY: number = 0;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    for (let i = 0; i < 30; i++) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 3 - i*0.1;
      this.ctx.strokeStyle = "rgba(255,0,0,1)";
      this.ctx.moveTo(initialX,initialY);

      newX = initialX + this.getRandomIntNegativeNumber(-10,10);
      newY = i*10;

      this.ctx.lineTo(newX, newY);
      this.ctx.stroke();
      this.ctx.closePath()
      this.drawShadow(initialX,initialY,newX,newY,this.ctx.lineWidth * 10);
      initialX = newX;
      initialY = newY;
    }
  }

  drawShadow(fromX: number, fromY: number, toX: number, toY: number, width: number) {
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = "rgba(255,0,0,0.3)";
    this.ctx.moveTo(fromX,fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.stroke();
    this.ctx.closePath();
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
