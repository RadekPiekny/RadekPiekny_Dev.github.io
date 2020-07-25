import { Component, OnInit, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { AppSettingsService } from 'src/app/services/appSettings.service';
import { interval, Subscription } from 'rxjs';
import { tap, switchMap, take, skip } from 'rxjs/operators';

@Component({
  selector: 'app-bitcoin',
  templateUrl: './bitcoin.component.html',
  styleUrls: ['./bitcoin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BitcoinComponent implements OnInit {
  themeModeSubscription: Subscription;
  exit: boolean = false;
  expandSelectionByPX: number = 0;
  zoomBounceWidth: number = 50;
  zoomBounceHeight: number = 50;
  connection: boolean = true;
  showShape: boolean = false;
  showFPS: boolean = false;

  nodeSizeMin: number = 0.9;
  nodeSizeMax: number = 1.5;

  velocityFrom: number = 0.5;
  velocityTo: number = 0.5;

  devicePixelRatio: number;

  bitcoinDrawWidth: number = 425;
  bitcoinDrawHeight: number = 600;

  canvasWidth: number = 212;
  canvasHeight: number = 300;

  nodesCount: number = 1000;
  pixelData = [];
  backgroundColor: string;
  nodeColor: string;
  nodeConnectionLineOpacity = 0.2;
  nodeConnectionLineColor: string;

  fps: number;
  frameTime: number;
  frameTimeSum: number = 0;
  lastLoop: number = 0;
  thisLoop: number = 0;
  updateFreq: number = 20;
  countToUpdate: number = 0;

  lineWidth: number = 0.3;
  maxLineDistanceRelative: number = 0.04;
  maxLineDistance: number;

  nodes = [];
  stoppedNodes: number = 0;
  duplicateNodes: Node[] = [];
  R: number = 20;
  running: boolean = true;
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  timer: number;

  constructor(
    private hostElement: ElementRef,
    private zone: NgZone,
    private appSettingsService: AppSettingsService
    ) {
    //this.zone.runOutsideAngular(() => { requestAnimationFrame(() => {}); });
  };

  setupCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    this.devicePixelRatio = window.devicePixelRatio || 1;

    canvas.nativeElement.width = this.canvasWidth * this.devicePixelRatio;
    canvas.nativeElement.height = this.canvasHeight * this.devicePixelRatio;
    canvas.nativeElement.style.width = (this.canvasWidth).toString() + "px";
    canvas.nativeElement.style.height = (this.canvasHeight).toString() + "px";

    this.maxLineDistance = this.maxLineDistanceRelative * this.canvasHeight;
    let canvas_context = this.canvas.nativeElement.getContext('2d');
    canvas_context.scale(this.devicePixelRatio, this.devicePixelRatio);
    return canvas_context;
  }

  ngOnInit() {
    this.nodeConnectionLineColor = this.nodeColorRGB();
    this.ctx = this.setupCanvas(this.canvas);
    this.ctx.fillStyle = this.backgroundColor;
    
    this.appSettingsService.MainBGColor$.subscribe(color => {
      console.log(color);
    })

    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawBitcoin2();
    this.getAllPixelArr();
    this.getAllPixelData();
    this.newNodes(this.nodesCount);
    this.animate();

    this.themeModeSubscription = this.appSettingsService.darkMode$.pipe(
      skip(1),
      switchMap(() => interval(30).pipe(
        take(20),
        tap(() => {
          this.nodeConnectionLineColor = this.nodeColorRGB();
        })
      ))).subscribe(
      () => {
        this.backgroundColor = getComputedStyle(this.hostElement.nativeElement).backgroundColor;
      }
    )
  }

  ngOnDestroy(): void {
    this.exit = true;
    this.themeModeSubscription.unsubscribe();
  }

  nodeColorRGB(): string {
    this.nodeColor = getComputedStyle(this.hostElement.nativeElement).color;
    let RGBvalues = this.nodeColor.substr(this.nodeColor.indexOf("(") + 1);
    RGBvalues = RGBvalues.substr(0,RGBvalues.length -1);
    return `rgba(${RGBvalues},${this.nodeConnectionLineOpacity})`
  }

  newNodes(change: number) {
    if (change < 0) {
      if (this.nodesCount - change < 0) {
        change = this.nodesCount;
      }
      for (let i = 0; i < Math.abs(change); i++) {
        this.nodes.shift();
      }
    }
    for (let i = 0; i < change; i++) {
      let newNode = new Node;

      do {
        newNode.x = this.getRandomIntNumber(0,this.canvasWidth);
        newNode.y = this.getRandomIntNumber(0,this.canvasHeight);
      }
      while (this.isInBitcoin(newNode,newNode.x, newNode.y) == false);
      newNode.r = this.getRandomNumber(this.nodeSizeMin,this.nodeSizeMax);
      newNode.velocity = this.getRandomNumber(this.velocityFrom,this.velocityTo);
      newNode.dir_x = this.getRandomNumber(-1,1) * newNode.velocity;
      newNode.dir_y = this.getRandomNumber(-1,1) * newNode.velocity;
      this.nodes.push(newNode);

    }
    this.nodesCount +=  change;
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

  

  animate() {
    if (this.exit) {
      return;
    }
    if (this.running) {
      this.moveNodes();
      this.calculateFPS();
      requestAnimationFrame(() => this.animate());
    }
  }

  calculateFPS() {
    if (this.countToUpdate >= this.updateFreq) {
      this.fps = Math.floor(1000 / (this.frameTimeSum / this.updateFreq));
      this.countToUpdate = 0;
      this.frameTimeSum = 0;
    }
    this.thisLoop = Date.now();
    const thisFrameTime = this.thisLoop- this.lastLoop;
    this.frameTimeSum += thisFrameTime;
    this.lastLoop = this.thisLoop;
    this.countToUpdate++
  }

  moveNodes() {
    this.ctx.fillStyle = getComputedStyle(this.hostElement.nativeElement).backgroundColor;
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    if (this.showShape) {
      this.drawBitcoin2();
    }
    if (this.showFPS) {
      this.drawFPS();
    }
    this.drawNodesCount();
    this.moveNodes_loopMethodFor();
  }

  moveNodes_loopMethodFor(){
    let x: number;
    let y: number;
    for (let index = 0; index < this.nodes.length; index++) {
      this.ctx.beginPath();
      x = this.nodes[index].x + this.nodes[index].dir_x * this.nodes[index].velocity;
      y = this.nodes[index].y + this.nodes[index].dir_y * this.nodes[index].velocity;
      if (this.isInBitcoin(this.nodes[index],x, y)) {
        this.nodes[index].x += this.nodes[index].dir_x * this.nodes[index].velocity;
        this.nodes[index].y += this.nodes[index].dir_y * this.nodes[index].velocity;
      } else {
        let newDirX: number;
        let newDirY: number;
        do {
          newDirX = this.getRandomNumber(-1,1);
          newDirY = this.getRandomNumber(-1,1);
        } while (this.newDirection(this.nodes[index],newDirX,newDirY) == false);

        this.nodes[index].dir_x = newDirX;
        this.nodes[index].dir_y = newDirY;
        this.nodes[index].x += this.nodes[index].dir_x
        this.nodes[index].y += this.nodes[index].dir_y
      }
      if (this.connection) {
        this.drawLines_loopMethodFor(this.nodes[index]);
      };
      this.ctx.arc(this.nodes[index].x, this.nodes[index].y, this.nodes[index].r, 0, Math.PI * 2, false);
      this.ctx.fillStyle = this.nodeConnectionLineColor;
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  newDirection(circle: Node, newDirX: number, newDirY: number): boolean {
    if (circle.x + newDirX < 0 || circle.y + newDirY < 0) {
      return false;
    }
    return this.isInBitcoin(circle, circle.x + newDirX, circle.y + newDirY);
  }

  drawBitcoin2() {
    let ratioX: number = this.canvasWidth / this.bitcoinDrawWidth / this.devicePixelRatio;
    let ratioY: number = this.canvasHeight / this.bitcoinDrawHeight / this.devicePixelRatio;

    this.ctx.beginPath();
    this.ctx.moveTo(25,525 * ratioY);
    this.ctx.lineTo(25,475 * ratioY);
    this.ctx.lineTo(75 * ratioX,475 * ratioY);
    this.ctx.lineTo(75 * ratioX,125 * ratioY);
    this.ctx.lineTo(25,125 * ratioY);
    this.ctx.lineTo(25,75 * ratioY);
    this.ctx.lineTo(120 * ratioX,75 * ratioY);
    this.ctx.lineTo(120 * ratioX,15 * ratioY);
    this.ctx.lineTo(190 * ratioX,15 * ratioY);
    this.ctx.lineTo(190 * ratioX,75 * ratioY);
    this.ctx.lineTo(240 * ratioX,75 * ratioY);
    this.ctx.lineTo(240 * ratioX,15 * ratioY);
    this.ctx.lineTo(310 * ratioX,15 * ratioY);
    this.ctx.lineTo(310 * ratioX,90 * ratioY);
    this.ctx.arc(275 * ratioX, 200 * ratioY, 125 * ratioX, this.degToRad(-90), this.degToRad(90), false);
    this.ctx.arc(275 * ratioX, 400 * ratioY, 125 * ratioX, this.degToRad(-90), this.degToRad(90), false);
    this.ctx.lineTo(310 * ratioX,500 * ratioY);
    this.ctx.lineTo(310 * ratioX,585 * ratioY);
    this.ctx.lineTo(240 * ratioX,585 * ratioY);
    this.ctx.lineTo(240 * ratioX,525 * ratioY);
    this.ctx.lineTo(190 * ratioX,525 * ratioY);
    this.ctx.lineTo(190 * ratioX,585 * ratioY);
    this.ctx.lineTo(120 * ratioX,585 * ratioY);
    this.ctx.lineTo(120 * ratioX,525 * ratioY);
    this.ctx.lineTo(25,525 * ratioY);

    this.ctx.moveTo(150 * ratioX,450 * ratioY);
    this.ctx.lineTo(275 * ratioX,450 * ratioY);
    this.ctx.arc(275 * ratioX, 400 * ratioY, 50 * ratioX, this.degToRad(90), this.degToRad(270), true);
    this.ctx.lineTo(150 * ratioX,350 * ratioY);
    this.ctx.lineTo(150 * ratioX,450 * ratioY);

    this.ctx.moveTo(150 * ratioX,250 * ratioY);
    this.ctx.lineTo(275 * ratioX,250 * ratioY);
    this.ctx.arc(275 * ratioX, 200 * ratioY, 50 * ratioX, this.degToRad(90), this.degToRad(270), true);
    this.ctx.lineTo(150 * ratioX,150 * ratioY);
    this.ctx.lineTo(150 * ratioX,250 * ratioY);

    this.ctx.fillStyle = "rgb(103,0,0)";
    this.ctx.fill();
    this.ctx.closePath();
  }

  degToRad(deg: number): number {
    return Math.PI / 180 * deg;
  }

  drawFPS() {
    this.ctx.font = "9px Arial";
    this.ctx.fillStyle = this.nodeColor;
    this.ctx.textAlign = "right";
    this.ctx.fillText("fps:" + this.fps, this.canvasWidth, 20 );
  }
  drawNodesCount() {
    this.ctx.font = "9px Arial";
    this.ctx.fillStyle = this.nodeColor;
    this.ctx.textAlign = "right";
    this.ctx.fillText("nodes:" + this.nodes.length, this.canvasWidth, 10 );
  }

  isInShape(x: number,y: number): boolean {
    let p = this.ctx.getImageData(x, y, 1, 1).data;
    if (p[0] == 103 && p[1] == 0 && p[2] == 0) {
      return true;
    }
    return false;
  }

  isInCanvas(x: number,y: number) {
    if (x > this.canvasWidth || x < 0) {
      return false
    }
    if (y > this.canvasHeight || y < 0) {
      return false
    }
    return true;
  }

  isInBitcoin(node: Node, x: number,y: number): boolean {
    if (x < 0 || y / 2 < 0 || x / 2 > this.canvasWidth || y / 2 > this.canvasHeight) {
      return false;
    }
    return this.pixelData[Math.floor(x)][Math.floor(y)];
  }

  jsonCopy(src: Object) {
    return JSON.parse(JSON.stringify(src));
  }

  stopAnimation(smooth: boolean = true) {
    if (this.running == true) {
      this.duplicateNodes = this.jsonCopy(this.nodes)
      this.reduceVelocity(true);
    } else {
      this.running = true;
      this.continueAnimation();
    }

  }

  reduceVelocity(Freeze: boolean = false) {
    this.nodes.forEach(c => {
      if (c.dir_x * 0.95 > 0.1 || c.dir_x * 0.95 < -0.1) {
        c.dir_x *= 0.95;
      } else {
        c.dir_x = 0;
      }
      if (c.dir_y * 0.95 > 0.1 || c.dir_y * 0.95 < -0.1) {
        c.dir_y *= 0.95;
      } else {
        c.dir_y = 0;
      }
    })
    if (Freeze && this.nodes.reduce((a, b) => a + b.dir_x, 0) !== 0) {
      requestAnimationFrame(() => this.reduceVelocity(true));
    } else {
      this.running = false;
    }

  }

  increaseVelocity(velocity: number = 0) {
    this.nodes.forEach((c,i) => {
      c.velocity = velocity;
    })
    this.moveNodes();
    if (velocity < 1) {
      requestAnimationFrame(() => this.increaseVelocity(velocity+0.01));
    } else {
      this.animate();
    }
  }

  continueAnimation() {
    this.nodes.forEach((c,i) => {
      c.dir_x = this.getRandomNumber(-1,1);
      c.dir_y = this.getRandomNumber(-1,1);
    })
    this.increaseVelocity();
  }

  startAnimation(smooth: boolean = true) {
    if (smooth) {
      this.nodes.forEach(c => {
        c.dir_x *= 1.05;
        c.dir_y *= 1.05;
      })
    }
  }

  drawLines_loopMethodFor(c: Node) {
    let distance: number;
    for (const node of this.nodes) {
      if (c == node) {
        return;
      }
      distance = this.getNodesDistance(c, node)
      if (distance < this.maxLineDistance) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.nodeConnectionLineColor;
        this.ctx.moveTo(c.x, c.y);
        this.ctx.lineTo(node.x,node.y);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
        //this.ctx.closePath();
      }
    }
  }

  drawLines_loopMethodForEach(c: Node) {
    let distance: number;
    this.nodes.forEach(node => {
      if (c == node) {
        return;
      }
      distance = this.getNodesDistance(c, node)
      if (distance < this.maxLineDistance) {
        this.ctx.strokeStyle = this.nodeConnectionLineColor;
        this.ctx.moveTo(c.x, c.y);
        this.ctx.lineTo(node.x,node.y);
      }
    })
  }

  getNodesDistance(node1: Node, node2: Node): number {
    return Math.floor(Math.sqrt(Math.pow(Math.abs(node2.x - node1.x),2) + Math.pow(Math.abs(node2.y - node1.y),2)));
  }

  getAllPixelArr() {
    this.pixelData = new Array(this.canvasWidth);
    for (var i = 0; i < this.pixelData.length; i++) {
      this.pixelData[i] = new Array(this.canvasHeight);
    }
  }

  getAllPixelData() {
    for (let w = 0; w < this.canvasWidth; w++) {
      for (let h = 0; h < this.canvasHeight; h++) {
        if(this.isInShape(w,h)) {
          this.pixelData[w][h]=true;
        } else {
          this.pixelData[w][h]=false;
        }
      }
    }
  }

  bounceCanvasSquare(origin: Node, destination: Node) {
    let start: IPoint;
    let end: IPoint;

    if (origin.y < destination.y) {
      start.y = origin.y;
      end.y = destination.y;
    } else {
      start.y = destination.y;
      end.y = origin.y;
    }

    if (origin.x < destination.x) {
      start.x = origin.x;
      end.x = destination.x;
    } else {
      start.x = destination.x;
      end.x = origin.x;
    }
  }

  createBounceCanvasDimension(start: IPoint, end: IPoint): boolean[][] {
    let result: boolean[][] = new Array(end.y - start.y).fill(false).map(() => new Array(end.x - start.x).fill(0));
    for (let x = start.x; x < end.x; x++) {
      for (let y = start.y; y < end.y; y++) {
        result[x][y] = this.pixelData[x][y];
      }
    }
    return result;
  }

  shapeEdge(bounceCanvas: boolean[][]) {
    for (let x = 0; x < bounceCanvas[0].length; x++) {

    }

    for (let x = 0; x < bounceCanvas[bounceCanvas.length - 1].length; x++) {

    }
  }



}

class Node {
  x: number;
  y: number;
  r: number;
  velocity: number;
  dir_x: number;
  dir_y: number;
}

interface IPoint {
  x: number;
  y: number;
}
