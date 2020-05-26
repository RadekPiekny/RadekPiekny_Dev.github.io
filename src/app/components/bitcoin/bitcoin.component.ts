import { Component, OnInit, ViewChild, ElementRef, NgZone, enableProdMode } from '@angular/core';

@Component({
  selector: 'app-bitcoin',
  templateUrl: './bitcoin.component.html',
  styleUrls: ['./bitcoin.component.css']
})
export class BitcoinComponent implements OnInit {
  expandSelectionByPX: number = 0;
  zoomBounceWidth: number = 50;
  zoomBounceHeight: number = 50;
  connection: boolean = true;
  showShape: boolean = false;
  nodeSizeMin: number = 0.2;
  nodeSizeMax: number = 0.5;
  devicePixelRatio: number;
  canvasWidth: number;
  canvasHeight: number;
  nodesCount: number = 300;
  pixelData = [];

  fps: number;
  frameTime: number;
  frameTimeSum: number = 0;
  lastLoop: number = 0;
  thisLoop: number = 0;
  updateFreq: number = 20;
  countToUpdate: number = 0;

  lineWidth: number = 0.3;
  maxLineDistance: number;

  nodes = [];
  stoppedNodes: number = 0;
  duplicateNodes: Node[] = [];
  R: number = 20;
  running: boolean = true;
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  timer: number;

  constructor(private zone: NgZone) {
    //this.zone.runOutsideAngular(() => { requestAnimationFrame(() => {}); });
  };

  setupCanvas(canvas: ElementRef<HTMLCanvasElement>) {
    let devicePixelRatio = window.devicePixelRatio || 1;
    var rect = this.canvas.nativeElement.getBoundingClientRect();
    canvas.nativeElement.width = rect.width * devicePixelRatio;
    canvas.nativeElement.height = rect.height * devicePixelRatio;
    this.canvasWidth = canvas.nativeElement.width;
    this.canvasHeight = canvas.nativeElement.height;
    this.maxLineDistance = 0.04 * this.canvasHeight;
    let canvas_context = this.canvas.nativeElement.getContext('2d');
    canvas_context.scale(devicePixelRatio, devicePixelRatio);
    return canvas_context;
  }

  ngOnInit() {
    this.ctx = this.setupCanvas(this.canvas);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawBitcoin();
    this.getAllPixelArr();
    this.getAllPixelData();
    this.newNodes(600);
    this.animate();
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
      while (this.isInShapeff(newNode.x, newNode.y) == false);
      newNode.r = this.getRandomNumber(this.nodeSizeMin,this.nodeSizeMax);
      newNode.velocity = this.getRandomNumber(0.4,1);
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

  getNodesDistance(node1: Node, node2: Node): number {
    let distance: number;
    let x2: number;
    let y2: number;
    x2 = Math.pow(Math.abs(node2.x - node1.x),2);
    y2 = Math.pow(Math.abs(node2.y - node1.y),2);
    distance = Math.floor(Math.sqrt(x2 + y2));
    return distance;
  }

  animate() {
    this.moveNodes();
    if (this.running) {
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
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    if (this.showShape) {
      this.drawBitcoin();
    }
    for (let index = 0; index < this.nodes.length; index++) {
      this.ctx.beginPath();
      if (this.isInShapeff(this.nodes[index].x + this.nodes[index].dir_x * this.nodes[index].velocity, this.nodes[index].y + this.nodes[index].dir_y * this.nodes[index].velocity)) {
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
        this.drawLines(this.nodes[index]);
      };
      this.ctx.arc(this.nodes[index].x, this.nodes[index].y, this.nodes[index].r, 0, Math.PI * 2, false);
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  drawBitcoin() {
    let blockWidth: number = 0.666 * this.canvasWidth * 0.08;
    let blockHeight: number = blockWidth * 1.5;
    let topLeftBlockPositionX: number = 0.5 * this.canvasWidth -  3.5 * blockWidth / 2;
    let topRightBlockPositionX: number = topLeftBlockPositionX + 2 * blockWidth;
    let topBlocksPositionY = 0.21 * this.canvasHeight;

    let botLeftBlockPositionX: number = topLeftBlockPositionX;
    let botRightBlockPositionX: number = topRightBlockPositionX;
    let botBlockcPositionY: number = 0.75 * this.canvasHeight;

    this.ctx.beginPath();
    this.ctx.fillStyle="rgb(103,0,0)";
    this.ctx.rect(topLeftBlockPositionX,topBlocksPositionY,blockWidth,blockHeight);
    this.ctx.rect(topRightBlockPositionX,topBlocksPositionY,blockWidth,blockHeight);
    this.ctx.rect(botLeftBlockPositionX,botBlockcPositionY, blockWidth, blockHeight);
    this.ctx.rect(botRightBlockPositionX,botBlockcPositionY, blockWidth, blockHeight);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.font = "100 " + 0.666 * this.canvasWidth + "px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "rgb(103,0,0)";
    this.ctx.fillText("B", 0.5 * this.canvasWidth, 0.76 * this.canvasHeight );
  }

  isInShape(x: number,y: number): boolean {
    let p = this.ctx.getImageData(x, y, 1, 1).data;
    if (p[0] == 0 && p[1] == 0 && p[2] == 0) {
      return false;
    }
    return true;
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

  isInShapeff(x: number,y: number): boolean {
    if (this.pixelData[Math.floor(x)][Math.floor(y)]) {
      return true;
    }
    return false;
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

  drawLines(c: Node) {
    let distance: number;

    for (const x of this.nodes) {
      if (c == x) {
        return;
      }
      distance = this.getNodesDistance(c, x)
      if (distance < this.maxLineDistance) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255,' + (0.3) + ')';
        this.ctx.moveTo(c.x, c.y);
        this.ctx.lineTo(x.x,x.y);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
        //this.ctx.closePath();
      }
    }
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

  newDirection(circle: Node, newDirX: number, newDirY: number): boolean {
    return this.isInShapeff(circle.x + newDirX, circle.y + newDirY);
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