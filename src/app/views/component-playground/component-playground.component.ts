import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'component-playground',
  templateUrl: './component-playground.component.html',
  styleUrls: ['./component-playground.component.css'],
  animations: [
    trigger("whatever", [
      state('open', style({
        height: '*',
        opacity: 1,
      })),
      state('closed', style({
        height: '0px',
        opacity: 1,
      })),
      transition('open => closed', [
        animate("1s ease",style({
          height: '0px',
          opacity: 1,
        }))
      ]),
      transition('closed => open', [
        animate("1s ease",style({
          height: '*',
          opacity: 1,
        }))
      ]),
    ])
  ]
})
export class ComponentPlaygroundComponent implements OnInit {
  divState: string = "open";
  constructor() { }

  ngOnInit(): void {
  }

}
