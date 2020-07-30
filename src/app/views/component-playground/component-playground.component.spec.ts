import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentPlaygroundComponent } from './component-playground.component';

describe('ComponentPlaygroundComponent', () => {
  let component: ComponentPlaygroundComponent;
  let fixture: ComponentFixture<ComponentPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
