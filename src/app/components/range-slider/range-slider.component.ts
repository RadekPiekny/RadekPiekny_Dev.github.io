import { Component, OnInit, ViewChild, ElementRef, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.css']
})
export class RangeSliderComponent implements OnInit {
  @Input() minValue: number = 0;
  @Input() maxValue: number = 1;
  @Input() label: string;
  @Input() decimalPlaces: number = 3;
  @Output() valueFrom: number;
  @Output() valueTo: number;
  subscription: Subscription[] = [];
  thumbGrapPosition: number;
  trackContainerLeft: number;
  trackContainerWidth: number;
  progressWidth: number
  progressStep: number;
  active: boolean = false;
  @ViewChild('thumbMinEl', { static: true }) thumbMinEl: ElementRef<HTMLDivElement>;
  @ViewChild('thumbMaxEl', { static: true }) thumbMaxEl: ElementRef<HTMLDivElement>;
  @ViewChild('track', { static: true }) track: ElementRef<HTMLDivElement>;
  @ViewChild('trackContainerEl', { static: true }) trackContainerEl: ElementRef<HTMLDivElement>;
  thumbMin: Thumb = new Thumb;
  thumbMax: Thumb = new Thumb;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.trackContainerLeft = this.trackContainerEl.nativeElement.getBoundingClientRect().left;
    this.trackContainerWidth = this.trackContainerEl.nativeElement.getBoundingClientRect().width;
    this.subscription.push(
      fromEvent(this.thumbMinEl.nativeElement, 'mousedown').subscribe(
        (res:MouseEvent) => {
          console.log(res);
          this.active = true;
          this.thumbGrapPosition = res.clientX -  this.thumbMinEl.nativeElement.getBoundingClientRect().left;
          this.getElementParams('min');
          this.ref.markForCheck();
        }
      )
    );
    this.subscription.push(
      fromEvent(this.thumbMaxEl.nativeElement, 'mousedown').subscribe(
        (res:MouseEvent)  => {
          console.log(res);
          this.active = true;
          this.thumbGrapPosition = res.clientX - this.thumbMaxEl.nativeElement.getBoundingClientRect().left;
          this.getElementParams('max');
          this.ref.markForCheck();
        }
      )
    );
  }

  getElementParams(thumb: string) {
    if (thumb === 'min') {
      this.thumbMin.active = true;
      this.thumbMax.active = false;
    } else {
      this.thumbMax.active = true;
      this.thumbMin.active = false;
    }
    this.thumbMin.left = this.thumbMinEl.nativeElement.getBoundingClientRect().left - this.trackContainerLeft;
    this.thumbMin.width = this.thumbMinEl.nativeElement.getBoundingClientRect().width;
    this.thumbMin.top = this.thumbMinEl.nativeElement.getBoundingClientRect().top;

    this.thumbMax.left = this.thumbMaxEl.nativeElement.getBoundingClientRect().left - this.trackContainerLeft;
    this.thumbMax.width = this.thumbMaxEl.nativeElement.getBoundingClientRect().width;
    this.thumbMax.top = this.thumbMaxEl.nativeElement.getBoundingClientRect().top;

    this.progressWidth = this.trackContainerWidth - this.thumbMin.width;
    this.progressStep = this.progressWidth / this.maxValue;

  }

  deactivate() {
    this.active = false;
    this.thumbMax.active = false;
    this.thumbMin.active = false;
  }

  valueChange(e: MouseEvent) {
    if (this.thumbMin.active) {
      this.thumbMinStepping(e.clientX);
    }
    if (this.thumbMax.active) {
      this.thumbMaxStepping(e.clientX);
    }
  }

  thumbMinSliding(clientX: number) {
    if (clientX - this.thumbGrapPosition< this.trackContainerLeft) {
      this.thumbMin.left = 0;
    } else if (clientX - this.trackContainerLeft - this.thumbGrapPosition > this.thumbMax.left) {
      this.thumbMin.left = this.thumbMax.left;
    } else {
      this.thumbMin.left = clientX - this.trackContainerLeft - this.thumbGrapPosition;
    }
    let val: number = (this.thumbMin.left / (this.trackContainerWidth - this.thumbMin.width)) * this.maxValue;
    val = parseFloat(val.toFixed(2));
    this.valueFrom = val;
  }

  thumbMaxSliding(clientX: number) {
    if (clientX - this.trackContainerLeft - this.thumbGrapPosition > this.trackContainerWidth - this.thumbMax.width) {
      this.thumbMax.left = this.trackContainerWidth - this.thumbMax.width;
    } else if (clientX - this.trackContainerLeft - this.thumbGrapPosition< this.thumbMin.left) {
      this.thumbMax.left = this.thumbMin.left;
    } else {
      this.thumbMax.left = clientX - this.trackContainerLeft - this.thumbGrapPosition;
    }
    let val: number = (this.thumbMax.left / (this.trackContainerWidth - this.thumbMax.width)) * this.maxValue;
    val = parseFloat(val.toFixed(2));
    this.valueTo = val;
  }

  thumbMinStepping(clientX: number) {
    let futureValue: number = (clientX - this.trackContainerLeft - this.thumbGrapPosition) / this.progressStep;
    futureValue = parseFloat(futureValue.toFixed(this.decimalPlaces));
    if (futureValue < this.minValue) {
      this.thumbMin.left = 0;
      this.valueFrom = this.minValue;
      return;
    }
    if (futureValue > this.valueTo) {
      this.thumbMin.left = this.thumbMax.left;
      this.valueFrom = this.valueTo;
      return;
    }
    this.thumbMin.left = futureValue * this.progressStep;
    this.valueFrom = futureValue;
  }

  thumbMaxStepping(clientX: number) {
    let futureValue: number = (clientX - this.trackContainerLeft - this.thumbGrapPosition) / this.progressStep;
    futureValue = parseFloat(futureValue.toFixed(this.decimalPlaces));
    if (futureValue > this.maxValue) {
      this.thumbMax.left = this.trackContainerWidth - this.thumbMax.width;
      this.valueTo = this.maxValue;
      return
    }
    if (futureValue < this.valueFrom) {
      this.thumbMax.left = this.thumbMin.left;
      this.valueTo = this.valueFrom;
      return;
    }
    this.thumbMax.left = futureValue * this.progressStep;
    this.valueTo = futureValue;
  }

  getThumbMaxStyle(): Object {
    if (this.active) {
      return {
        'transform': 'translateX(' + this.thumbMax.left + 'px)',
        'background-color': 'rgba(255, 255, 255, 0.1)'
      };
    }
    return {
      'transform': 'translateX(' + this.thumbMax.left + 'px)',
      'background-color': 'transparent'
    };
  }

  getThumbMinStyle(): Object {
    if (this.active) {
      return {
        'transform': 'translateX(' + this.thumbMin.left + 'px)',
        'background-color': 'rgba(255, 255, 255, 0.1)'
      };
    }
    return {
      'transform': 'translateX(' + this.thumbMin.left + 'px)',
      'background-color': 'transparent'
    };
  }

  getFromtToStyle():Object {
    return {
      'transform': 'translateX(' + this.thumbMin.left + 'px)',
      'width': (this.thumbMax.left - this.thumbMin.left) + 'px'
    };
  }

  ngOnDestroy(): void {
    this.subscription.forEach(s => {
      s.unsubscribe;
    })
  }

  shrinkThumb(): Object {
    let diff: number = this.thumbMax.left - this.thumbMin.left;
    if (diff > this.thumbMin.width) {
      return {
        "width": "12px",
        "height": "12px"
      }
    }
    let size: number = 1 + (diff / this.thumbMin.width) * 11
    if (size < 6) {
      size = 0;
    }
    if (diff == 0) {
      return {
        "width": "12px",
        "height": "12px"
      }
    }
    return {
      "width": size + "px",
      "height": size + "px"
    }
  }

  minValueTextPosition(): Object {
    let diff: number = this.thumbMax.left - this.thumbMin.left;
    if (this.minValue == this.valueFrom) {
      return {
        "transform": "scale(0)"
      }
    }
    if (diff < this.thumbMin.width) {

      let translate: number = (this.thumbMin.width - diff) * -1;
      if (diff == 0) {
        return {
          "transform": "translateX(" + translate / 3 + "px) scale(0)"
        }
      }
      return {
        "transform": "translateX(" + translate / 3 + "px)"
      }
    }
  }

  maxValueTextPosition(): Object {
    let diff: number = this.thumbMax.left - this.thumbMin.left;
    if (this.maxValue == this.valueTo) {
      return {
        "transform": "scale(0)"
      }
    }
    if (diff < this.thumbMax.width) {
      let translate: number = this.thumbMin.width - diff;
      if (diff == 0) {
        return;
      }
      return {
        "transform": "translateX(" + translate / 3 + "px)"
      }
    }
  }

}

class Thumb {
  top: number;
  left: number;
  width: number;
  active: boolean;
}