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
          date: new Date(2001,0,1),
          value: 10
        },
        {
          date: new Date(2013,10,1),
          value: 50
        },
        {
          date: new Date(2002,0,1),
          value: 20
        }
      ],
      startDate: new Date(2001,0,1),
      endDate: new Date()
    }
    this.date = new Date(2001,9,1);
    this.params = this.paramsSortByDate(this.params);

    //this.skillValue = this.calculateDatePositionPercentage(this.params.startDate, this.params.endDate,this.date);
    this.skillValue = this.calculateSkill();
    console.log(this.skillValue);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.date) {
      this.skillValue = this.calculateDatePositionPercentage(this.params.startDate, this.params.endDate,this.date);
    }
    if (changes.params) {
      this.params = this.paramsSortByDate(this.params);
    }
  }

  paramsSortByDate(params: SkillRangeComponentParams): SkillRangeComponentParams {
    let newDates = params.dates.sort((a,b) => {
      return a.date.getTime() - b.date.getTime()
    })
    params.dates = newDates;
    return params;
  }

  calculateDatePositionPercentage(startDate: Date, endDate: Date, skillDate: Date): number {
    let timeRange: number = endDate.getTime() - startDate.getTime();
    let currentTime: number = skillDate.getTime() - startDate.getTime()
    return currentTime / timeRange * 100;
  }

  calculateSkill(datePositionPercentage?: number): number {
    let fromDate: SkillRangeComponentParamDate;
    let toDate: SkillRangeComponentParamDate;
    let i: number = this.params.dates.reverse().findIndex( d => d.date < this.date);
    this.params.dates.reverse(); //reverse changes original array
    i = this.params.dates.length - i - 1;
    if (i == 0 && this.params.dates.length == 1) {
      return this.params.dates[0].value
    }
    if (this.date.getTime() > this.params.dates[this.params.dates.length - 1].date.getTime()) {
      return this.params.dates[this.params.dates.length - 1].value
    }
    let DatePositionPercentage: number = this.calculateDatePositionPercentage(this.params.dates[i].date,this.params.dates[i+1].date,this.date)
    return this.params.dates[i+1].value * DatePositionPercentage / 100
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