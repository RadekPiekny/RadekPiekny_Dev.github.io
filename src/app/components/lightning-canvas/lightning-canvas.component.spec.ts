import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightningCanvasComponent } from './lightning-canvas.component';

describe('LightningCanvasComponent', () => {
  let component: LightningCanvasComponent;
  let fixture: ComponentFixture<LightningCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightningCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightningCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
