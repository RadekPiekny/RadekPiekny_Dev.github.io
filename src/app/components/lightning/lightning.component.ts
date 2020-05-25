import { RangeSliderComponent } from '../range-slider/range-slider.component';
import { Component, OnInit, ElementRef, ViewChild, ViewChildren, ChangeDetectionStrategy, Input, ChangeDetectorRef, QueryList } from '@angular/core';
import { TweenMax, TimelineMax, Power2 } from 'gsap';
import { Lightning, Point, Line, Tendency, RND } from '../../models/lightning.model';

@Component({
  selector: 'app-lightning',
  templateUrl: './lightning.component.html',
  styleUrls: ['./lightning.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightningComponent implements OnInit {
  lightningCount: number = 0;
  maxLightningChains: number = 0;j
  @Input() lightnings: Lightning[] = [];
  cardTransform: string;
  @ViewChild('card') card: ElementRef;
  @ViewChildren('lightningPolyPath') lightningPolyPath: QueryList<ElementRef>;
  @ViewChild('positionFromTo') positionFromTo: RangeSliderComponent;
  @ViewChild('animationSpeed') animationSpeed: RangeSliderComponent;
  @ViewChild('chains') chains: RangeSliderComponent;
  @ViewChild('startWidth') startWidth: RangeSliderComponent;
  @ViewChild('endWidth') endWidth: RangeSliderComponent;

  tween_test;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {

  }

  tween(): void {
    //const tl = new TimelineMax();
    //tl.add(this.tween_test.play());
      let transformPositions: RND[] = [];
      for (let i = 0; i < 6; i++) {
        let rnd: RND = new RND;
        rnd.x = this.getRandomArbitrary(-2.1,2.1);
        rnd.y = this.getRandomArbitrary(-2.1,2.1);
        transformPositions.push(rnd);
      }
      let ms: number = 0.1;
      this.tween_test = TweenMax.to(this.card.nativeElement, 0.05, {x: transformPositions[0].x,y: transformPositions[0].y, delay: 0});
      this.tween_test = TweenMax.to(this.card.nativeElement, 0.1, {x: -1 * transformPositions[0].x,y: -1 * transformPositions[0].y, delay: 0.05});
      this.tween_test = TweenMax.to(this.card.nativeElement, 0.12, {x: transformPositions[1].x,y: transformPositions[1].y, delay: 0.15});
      this.tween_test = TweenMax.to(this.card.nativeElement, 0.15, {x: -1 * transformPositions[1].x,y: -1 * transformPositions[1].y, delay: 0.27});
      this.tween_test = TweenMax.to(this.card.nativeElement, 0.18, {x: 0,y: 0, delay: 0.42});
  }

  generateNewLightning() {
    this.lightnings = []
    let l: Lightning = new Lightning;
    l.start.x = this.getRandomArbitrary(this.positionFromTo.valueFrom,this.positionFromTo.valueTo);
    l.start.y = 0;
    l.animationSpeed = this.getRandomArbitrary(this.animationSpeed.valueFrom,this.animationSpeed.valueTo);
    l.countPoints = 90;
    l.lightningChain = this.getRandomInt(this.chains.valueFrom,this.chains.valueTo);
    l.tendency.left = 2;
    l.tendency.right = -3;
    l.bezier = false;
    l.startWidth = this.getRandomArbitrary(this.startWidth.valueFrom,this.startWidth.valueTo);
    l.endWidth = this.getRandomArbitrary(this.endWidth.valueFrom,this.endWidth.valueTo);
    this.generate(l,-1);
  }

  generate(l: Lightning, parentId: number) {
    let widthDiffPerPoint: number;
    //this.paintLoop();
    let lightning: Lightning = new Lightning;
    lightning.animationSpeed = l.animationSpeed;
    lightning.startWidth = l.startWidth;
    lightning.points = [];
    let startingPoint: Point = new Point;
    startingPoint.x = l.start.x;
    startingPoint.y = l.start.y;
    lightning.bezier = l.bezier;
    lightning.points.push(startingPoint);
    lightning.id = this.lightnings.length;
    lightning.parentId = parentId;
    lightning.startProgressParent = l.startProgressParent;
    lightning.tendency.left = l.tendency.left;
    lightning.tendency.right = l.tendency.right;

    for (let i = 1; i < l.countPoints; i++) {
      let point: Point = new Point;
      point.x = lightning.points[i-1].x + this.getRandomArbitrary(l.tendency.left,l.tendency.right);
      point.y = lightning.points[i-1].y + this.getRandomArbitrary(1,2);
      lightning.points.push(point);
    }

    if (l.startWidth != l.endWidth) {
      let pointsBack: Point[] = this.getNarrowingLine(lightning.points,l.startWidth,l.endWidth);
      try {
        lightning.points.push(...pointsBack);
      } catch (error) {
        console.log(pointsBack);
      }
    }
    this.generatePath(lightning);
    this.lightnings.push(lightning);
    this.changeAnimationRatio(lightning);

    for (let i = 0; i < l.lightningChain; i++) {
      let sideLightning: Lightning = new Lightning;
      if (lightning.points.length < 2) {
        return
      }
      let rndPoint: number = this.getRandomInt(1,lightning.points.length - 1);
      for (let index = 1; index < rndPoint + 1; index++) {
        let squareX = Math.pow((lightning.points[index].x - lightning.points[index-1].x),2)
        let squareY = Math.pow((lightning.points[index].y - lightning.points[index-1].y),2)
        sideLightning.startProgressParent += Math.sqrt(squareX + squareY);
      }
      let rndTendancyDirection: string;
      sideLightning.start.x = lightning.points[rndPoint].x;
      sideLightning.start.y = lightning.points[rndPoint].y;
      sideLightning.animationSpeed = l.animationSpeed;
      sideLightning.bezier = l.bezier;
      sideLightning.lightningChain = Math.floor(this.getRandomInt(0,l.lightningChain / 1.5));
      sideLightning.countPoints = this.getRandomInt(0,l.countPoints);
      sideLightning.startWidth = lightning.points[rndPoint].width;
      sideLightning.endWidth = 0;
      sideLightning.tendency.left = this.getRandomArbitrary(0,0);
      sideLightning.tendency.right = this.getRandomArbitrary(4,10);
      this.generate(sideLightning,lightning.id);
    }
  }

  autoGenerate() {
    for (let index = 0; index < 300; index++) {
      let rnd: number = this.getRandomArbitrary(0,50000);
      setTimeout(() => {

      }, rnd);
    }

  }

  lightningChanneling(l: Lightning, original: Lightning, variation: number = this.getRandomArbitrary(-0.3,0.3)) {

    for (let i = 0; i < l.points.length; i++) {
      l.points[i].x = original.points[i].x + variation;
      l.points[i].y = original.points[i].y + variation;
    }
  }

  removeLightning(id: number) {
    this.lightnings.forEach((l,index) => {
      if (l.id == id) {
        this.lightnings.splice(index, 1);
      }
    })
  }

  getRandomArbitrary(min: number, max: number) {
    let rnd: number = Math.random() * (max - min) + min;
    rnd.toFixed(2);
    return rnd;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rnd(max: number): number {
    return (Math.random() * 2 - 1) * (max);
  }

  generatePath(l: Lightning) {
    if (l.bezier) {
      l.pointsString = this.makePath(l)
    }
    if (l.bezier == false) {
      l.pointsString = this.generetePointsString(l)
    }
  }

  paintLightning(l: Lightning, original: Lightning) {
    if (l) {
      //this.lightningChanneling(l,original);
      requestAnimationFrame(() => this.paintLightning(l,original));
    }
  }

  generetePointsString(l: Lightning): string {
    let text: string = "";
    l.points.forEach(p => {
      text += p.x + "," + p.y + " "
    });
    return text;
  }

  makePath(l: Lightning): string {
    var result = "M" + l.points[0].x + "," + l.points[0].y + " ";
    var catmull = this.catmullRom2bezier(l.points);
    for (var i = 0; i < catmull.length; i++) {
      result += "C" + catmull[i][0].x + "," + catmull[i][0].y + " " + catmull[i][1].x + "," + catmull[i][1].y + " " + catmull[i][2].x + "," + catmull[i][2].y + " ";
    }
    return result;
  }

  catmullRom2bezier(point: Point[]) {
    var result = [];
    for (var i = 0; i < point.length - 1; i++) {
      var p = [];

      p.push({
        x: point[Math.max(i - 1, 0)].x,
        y: point[Math.max(i - 1, 0)].y
      });
      p.push({
        x: point[i].x,
        y: point[i].y
      });
      p.push({
        x: point[i + 1].x,
        y: point[i + 1].y
      });
      p.push({
        x: point[Math.min(i + 2, point.length - 1)].x,
        y: point[Math.min(i + 2, point.length - 1)].y
      });

      // Catmull-Rom to Cubic Bezier conversion matrix
      //    0       1       0       0
      //  -1/6      1      1/6      0
      //    0      1/6      1     -1/6
      //    0       0       1       0

      var bp = [];
      bp.push({
        x: ((-p[0].x + 6 * p[1].x + p[2].x) / 6),
        y: ((-p[0].y + 6 * p[1].y + p[2].y) / 6)
      });
      bp.push({
        x: ((p[1].x + 6 * p[2].x - p[3].x) / 6),
        y: ((p[1].y + 6 * p[2].y - p[3].y) / 6)
      });
      bp.push({
        x: p[2].x,
        y: p[2].y
      });
      result.push(bp);
    }

    return result;
  }

  getLightningStyle(lightning: Lightning): object {
    if (lightning.bezier) {
      return {
        'fill': 'white',
        'stroke': 'white',
        'stroke-width': .1,
      }
    }
    return {
      'stroke': 'white',
      'stroke-width': .1,
      'fill':'none'
    }
  }

  changeAnimationRatio(l: Lightning) {
    if (l.animationRatio <= 100) {
      if (l.id == 0) {
        l.animationRatio = l.animationRatio + l.animationSpeed;
      } else {
        let parentLightningTotal: number;
        this.lightningPolyPath.forEach((path,index) => {
          if (index == l.parentId) {
            parentLightningTotal = path.nativeElement.getTotalLength() / 2;  // divide by 2 becouse path goes back up so that we can have lightning width different base
          }
          //console.log("Lightning id" + index + " has " + parentLightningTotal + "lenght in units.");
        })
        let parentLightningProgress = this.lightnings[l.parentId].animationRatio / 100 * parentLightningTotal;
        if (parentLightningProgress> l.startProgressParent) {
          l.animationRatio = l.animationRatio + l.animationSpeed;
        }
      }
      requestAnimationFrame(() => this.changeAnimationRatio(l));
    } else {
      //this.removeLightning(l.id);
    }
    this.ref.markForCheck();
  }

  mirrorPointBackward(pointFrom: Point, pointTo: Point, pointStart: Point, distance: number): Point {
    let newPoint: Point;
    let mirrorPoint: Point;
    let angle: number;
    let a: number;
    let b: number;
    let c: number;
    a = pointTo.y - pointFrom.y;
    b = pointTo.x - pointFrom.x;
    c = Math.hypot(a,b);

    if (pointStart.x == pointTo.x) {
      //a line
      newPoint.x = pointTo.x + distance;
      newPoint.y = pointTo.y;
      return newPoint;
    }
    if (pointStart.x < pointTo.x) {
      //tupy uhel
      return;
    }
    if (pointStart.x > pointTo.x) {
      //ostry uhel
      return;
    }
  }

  getNarrowingLine(line:Point[],startWidth:number = 20,endWidth:number = 0):Point[] {
    let stepDiffWidth: number = ( startWidth - endWidth) / (line.length - 1);
    line.forEach((p,i) => {
      p.width = startWidth - stepDiffWidth * i;
    });
    let mirrorLine: Line[] = [];
    for (let index = line.length-1; index > 0; index--) {
      let newMirrorLine: Line = new Line;
      newMirrorLine.p1 = line[index];
      newMirrorLine.p2 = line[index - 1];
      mirrorLine.push(this.mirrorLine(newMirrorLine));
    }
    let firstLinePart: Line = new Line();
    firstLinePart.p1 = line[1];
    firstLinePart.p2 = line[0];

    let newLine: Point[] = this.getReturnPoints(mirrorLine,firstLinePart);
    return newLine;
  }

  getReturnPoints(mirrorLines: Line[], firstLine: Line):Point[]{
    let returnPoints: Point[] = [];
    if (mirrorLines.length < 2) {
      return null;
    }
    for (let index = 1; index < mirrorLines.length; index++) {
      let newPoint: Point = this.intersect(mirrorLines[index - 1],mirrorLines[index]);
      returnPoints.push(newPoint);
    }
    returnPoints.push(this.getPerpendicularEndPoint(firstLine, firstLine.p2.width));
    return returnPoints;
  }

  mirrorLine(line: Line):Line {
    let xDiff: number = line.p1.x - line.p2.x;
    let yDiff: number = line.p1.y - line.p2.y;
    let ratio: number;

    let newLine: Line = new Line;
    ratio = line.p1.width / Math.hypot(xDiff, yDiff);
    newLine.p1.x = line.p1.x + ratio * yDiff;
    newLine.p1.y = line.p1.y - ratio * xDiff;

    ratio = line.p2.width / Math.hypot(xDiff, yDiff);


    if (xDiff > 0) {
      newLine.p2.x = line.p2.x + ratio * yDiff;
      newLine.p2.y = line.p2.y - ratio * xDiff;

      newLine.p2.x -= newLine.p1.x - newLine.p2.x;
      newLine.p2.y -= newLine.p1.y - newLine.p2.y;
    } else {
      newLine.p2.x = line.p2.x + ratio * yDiff;
      newLine.p2.y = line.p2.y - ratio * xDiff;

      newLine.p2.x += newLine.p2.x - newLine.p1.x;
      newLine.p2.y += newLine.p2.y - newLine.p1.y;
    }
    let ff:Line = this.extendAbscissa(newLine,500,500);
    return ff;
  }

  extendAbscissa(line: Line, viewBoxHeight: number, viewBoxWidth: number): Line {
    let newLine: Line = new Line;
    let a: number = line.p2.y - line.p1.y;
    let b: number = line.p2.x - line.p1.x;
    let c: number = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
    let cossinus: number = a / c;
    let sinus: number = b / c;

    let newA: number;
    let newC: number;
    let newB: number;

    newA = line.p1.y;
    newC = newA / cossinus;
    newB = newC * sinus;
    newLine.p1.x = line.p1.x - newB;
    newLine.p1.y = 0;

    newA = viewBoxHeight - line.p1.y;
    newC = newA / cossinus;
    newB = newC * sinus;
    newLine.p2.x = line.p1.x + newB;
    newLine.p2.y = viewBoxHeight;
    return newLine;
  }

  intersect(l1:Line, l2:Line): Point {
    if ((l1.p1.x === l1.p2.x && l1.p2.x === l1.p2.x) || (l2.p1.x === l2.p2.x && l2.p2.x === l2.p2.x)) {
      return null
    }
    let denominator = ((l2.p2.y - l2.p1.y) * (l1.p2.x - l1.p1.x) - (l2.p2.x - l2.p1.x) * (l1.p2.y - l1.p1.y))
    if (denominator === 0) {
      return null
    }
    let ua = ((l2.p2.x - l2.p1.x) * (l1.p1.y - l2.p1.y) - (l2.p2.y - l2.p1.y) * (l1.p1.x - l2.p1.x)) / denominator
    let ub = ((l1.p2.x - l1.p1.x) * (l1.p1.y - l2.p1.y) - (l1.p2.y - l1.p1.y) * (l1.p1.x - l2.p1.x)) / denominator
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return null
    }
    let x = l1.p1.x + ua * (l1.p2.x - l1.p1.x)
    let y = l1.p1.y + ua * (l1.p2.y - l1.p1.y)
    return {x, y}
  }

  getPerpendicularEndPoint(line: Line, d: number): Point {
    return {
      x:line.p2.x+d*(line.p1.y-line.p2.y)/Math.sqrt(Math.pow(line.p1.x-line.p2.x,2)+Math.pow(line.p1.y-line.p2.y,2)),
      y:line.p2.y-d*(line.p1.x-line.p2.x)/Math.sqrt(Math.pow(line.p1.x-line.p2.x,2)+Math.pow(line.p1.y-line.p2.y,2))
    }
  }

}

