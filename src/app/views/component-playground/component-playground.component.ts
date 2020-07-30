import { Component, OnInit } from '@angular/core';
import { faCogs} from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'component-playground',
  templateUrl: './component-playground.component.html',
  styleUrls: ['./component-playground.component.css']
})
export class ComponentPlaygroundComponent implements OnInit {
  faCogs = faCogs;
  constructor() { }

  ngOnInit(): void {
  }

}
