import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FpsMeterComponent } from './fps-meter.component';

describe('FpsMeterComponent', () => {
  let component: FpsMeterComponent;
  let fixture: ComponentFixture<FpsMeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpsMeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpsMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
