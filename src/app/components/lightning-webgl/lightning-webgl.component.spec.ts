import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightningWebglComponent } from './lightning-webgl.component';

describe('LightningWebglComponent', () => {
  let component: LightningWebglComponent;
  let fixture: ComponentFixture<LightningWebglComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightningWebglComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightningWebglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
