import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FpsMeterCanvasComponent } from './fps-meter-canvas.component';

describe('FpsMeterCanvasComponent', () => {
  let component: FpsMeterCanvasComponent;
  let fixture: ComponentFixture<FpsMeterCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpsMeterCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpsMeterCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
