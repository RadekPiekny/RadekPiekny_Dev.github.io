import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'skill-range',
  templateUrl: './skill-range.component.html',
  styleUrls: ['./skill-range.component.css']
})
export class SkillRangeComponent {
  @Input() value: number; //max 100 as in %
}