import { RangeSliderComponent } from './../components/range-slider/range-slider.component';
import { Component, OnInit, ElementRef, ViewChild, ViewChildren, ChangeDetectionStrategy, Input, ChangeDetectorRef, QueryList } from '@angular/core';
import { TweenMax, TimelineMax, Power2 } from 'gsap';
import { Lightning, Point, Tendency, RND } from '../models/lightning.model';

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
  @ViewChild('card',{static: false}) card: ElementRef;
  @ViewChildren('lightningPolyPath') lightningPolyPath: QueryList<ElementRef>;
  @ViewChild('positionFromTo',{static: false}) positionFromTo: RangeSliderComponent;
  @ViewChild('animationSpeed',{static: false}) animationSpeed: RangeSliderComponent;
  @ViewChild('chains',{static: false}) chains: RangeSliderComponent;
  @ViewChild('startWidth',{static: false}) startWidth: RangeSliderComponent;
  @ViewChild('endWidth',{static: false}) endWidth: RangeSliderComponent;

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
    let l: Lightning = new Lightning;
    l.start.x = this.getRandomArbitrary(this.positionFromTo.valueFrom,this.positionFromTo.valueTo);
    l.start.y = 0;
    l.animationSpeed = this.getRandomArbitrary(this.animationSpeed.valueFrom,this.animationSpeed.valueTo);
    l.countPoints = 60;
    l.lightningChain = this.getRandomArbitrary(this.chains.valueFrom,this.chains.valueTo);
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
      for (let i = 1; i < l.countPoints; i++) {
        let point: Point = new Point;
        widthDiffPerPoint = (l.startWidth - l.endWidth) / (l.countPoints - 1);
        point.x = lightning.points[l.countPoints - i - 1].x + i * widthDiffPerPoint;

        point.y = lightning.points[l.countPoints - i - 1].y;
        lightning.points.push(point);
      }
    }
    this.generatePath(lightning);
    this.lightnings.push(lightning);
    this.changeAnimationRatio(lightning);

    for (let i = 0; i < l.lightningChain; i++) {
      let sideLightning: Lightning = new Lightning;
      let rndPoint: number = this.getRandomInt(0,lightning.points.length - 1);
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
      sideLightning.startWidth = this.getRandomArbitrary(0.1,l.startWidth - (rndPoint * widthDiffPerPoint));
      sideLightning.endWidth = 0.1;
      sideLightning.tendency.left = this.getRandomArbitrary(0,0);
      sideLightning.tendency.right = this.getRandomArbitrary(4,10);
      this.generate(sideLightning,lightning.id);
    }

    //let original: Lightning = JSON.parse(JSON.stringify(lightning))
    //this.tween();
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

}

