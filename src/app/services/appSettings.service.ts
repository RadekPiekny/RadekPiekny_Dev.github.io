import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  darkMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  MainBGColor$: Subject<string> = new Subject<string>();
  
}
