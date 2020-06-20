import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  darkMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
}
