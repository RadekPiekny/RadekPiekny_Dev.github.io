import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-bitcoin',
  templateUrl: './bitcoin.component.html',
  styleUrls: ['./bitcoin.component.css']
})
export class BitcoinComponent implements OnInit {

  devicePixelRatio: number;
  canvasWidth: number;
  canvasHeight: number;
  nodesCount: number = 300;
  pixelData = [];
  nodes = [];
  stoppedNodes: number = 0;
  duplicateNodes = [];
  R: number = 20;
  running: boolean = true;
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  timer: number;

  constructor(private zone: NgZone) {
    this.zone.runOutsideAngular(() => { requestAnimationFrame(() => {}); });
  };

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

  ngOnInit() {
    this.ctx = this.setupCanvas(this.canvas);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawBitcoin();
    this.getAllPixelArr();
    this.getAllPixelData();
    this.createNodes();
    this.animate();
  }

  createNodes() {
    for (let index = 0; index < this.nodesCount; index++) {
      let newNode = new Node;

      do {
        newNode.x = this.getRandomIntNumber(0,this.canvasWidth);
        newNode.y = this.getRandomIntNumber(0,this.canvasHeight);
      }
      while (this.isInShapeff(newNode.x, newNode.y) == false);
      newNode.r = this.getRandomIntNumber(1,3);
      newNode.velocity = this.getRandomIntNumber(1,2);
      newNode.dir_x = this.getRandomNumber(-1,1);
      newNode.dir_y = this.getRandomNumber(-1,1);
      this.nodes.push(newNode);

    }
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
      newNode.r = this.getRandomIntNumber(1,3);
      newNode.velocity = this.getRandomIntNumber(1,2);
      newNode.dir_x = this.getRandomNumber(-1,1);
      newNode.dir_y = this.getRandomNumber(-1,1);
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

  getNodesDistance(node1: Node, node2: Node): number {
    let distance: number;
    let x2: number;
    let y2: number;
    x2 = Math.pow(Math.abs(node2.x - node1.x),2);
    y2 = Math.pow(Math.abs(node2.y - node1.y),2);
    distance = Math.floor(Math.sqrt(x2 + y2));
    return distance;
  }

  runAnimation() {
    this.running = !this.running;
  }

  animate() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.nodes.forEach(circle => {
      this.ctx.beginPath();
      if (this.isInShapeff(circle.x + circle.dir_x, circle.y + circle.dir_y)) {
        circle.x = circle.x + circle.dir_x
        circle.y = circle.y + circle.dir_y
        this.ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.fill();
        this.drawLines(circle);
      } else {
        circle.dir_x *= -1;
        circle.dir_y *= -1;
        circle.x = circle.x + circle.dir_x
        circle.y = circle.y + circle.dir_y
        this.ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.fill();
        this.drawLines(circle);
      }
      this.ctx.closePath();
    })
    requestAnimationFrame(() => this.animate());
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
    //this.duplicateNodes = this.jsonCopy(this.nodes)
    if (smooth) {
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
    }
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
    this.nodes.forEach(circle => {
      let distance: number;
      if (c == circle) {
        return;
      }
      distance = this.getNodesDistance(c, circle)
      if (distance < 0.05 * this.canvasHeight) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255,' + (1 - (distance / 40)) + ')';
        this.ctx.moveTo(c.x, c.y);
        this.ctx.lineTo(circle.x,circle.y);
        this.ctx.lineWidth = 0.3;
        this.ctx.stroke();
        this.ctx.closePath();
      }
    })
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

}

class Node {
  x: number;
  y: number;
  r: number;
  velocity: number;
  dir_x: number;
  dir_y: number;
}
