import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillRangeComponent } from './skill-range.component';

describe('SkillRangeComponent', () => {
  let component: SkillRangeComponent;
  let fixture: ComponentFixture<SkillRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
