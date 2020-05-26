import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'skill-range',
  templateUrl: './skill-range.component.html',
  styleUrls: ['./skill-range.component.css']
})
export class SkillRangeComponent implements OnInit {
  @Input() params: SkillRangeComponentParams;
  @Input() date: Date;

  skillValue: number; //being from 0 to 100
  constructor() { }

  ngOnInit(): void {
    this.params = {
      dates: [
        {
          date: new Date(2001,10,1),
          value: 10
        },
        {
          date: new Date(2003,10,1),
          value: 20
        }
      ],
      startDate: new Date(2020,4,1),
      endDate: new Date()
    }
    this.date = new Date(2020,4,26);

    this.skillValue = this.calculateSkill(this.params.startDate, this.params.endDate,this.date);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.date) {
      this.skillValue = this.calculateSkill(this.params.startDate, this.params.endDate,this.date);
    }
  }

  calculateSkill(startDate: Date, endDate: Date, skillDate: Date): number {
    let timeRange: number = endDate.getTime() - startDate.getTime();
    let currentTime: number = skillDate.getTime() - startDate.getTime()
    return currentTime / timeRange * 100;
  }

}

interface SkillRangeComponentParams {
  dates: SkillRangeComponentParamDate[];
  startDate: Date;
  endDate: Date;
}

interface SkillRangeComponentParamDate {
  date: Date;
  value: number;
}