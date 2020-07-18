import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-lightning-webgl',
  templateUrl: './lightning-webgl.component.html',
  styleUrls: ['./lightning-webgl.component.css']
})
export class LightningWebglComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  canvasWidth: number = 300;
  canvasHeight: number = 300;
  gl: WebGL2RenderingContext;
  constructor() { }

  ngOnInit(): void {
    this.gl = this.setupCanvas(this.canvas);
    this.loop();
  }

  setupCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    let devicePixelRatio = window.devicePixelRatio;
    var rect = canvas.nativeElement.getBoundingClientRect();
    canvas.nativeElement.width = this.canvasWidth *devicePixelRatio;
    canvas.nativeElement.height = this.canvasWidth *devicePixelRatio;
    canvas.nativeElement.style.width = (this.canvasWidth).toString() + "px";
    canvas.nativeElement.style.height = (this.canvasWidth).toString() + "px";
    let canvas_context = canvas.nativeElement.getContext('webgl2');
    //canvas_context.scale(devicePixelRatio, devicePixelRatio);
    return canvas_context;
  }

  loop() {
    this.update();
    requestAnimationFrame(() => this.loop());
  }

  update() {
    this.gl.viewport(0,0,this.canvasWidth,this.canvasHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.flush();
  }

  drawPoint() {
    var point = [0.0, 0.0, 0.0];
    var color = [1.0, 0.0, 0.0, 1.0];
    var size = [400.0];
  }

}
