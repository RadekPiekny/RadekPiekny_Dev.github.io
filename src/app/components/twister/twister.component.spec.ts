import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwisterComponent } from './twister.component';

describe('TwisterComponent', () => {
  let component: TwisterComponent;
  let fixture: ComponentFixture<TwisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
