import { Injectable } from '@angular/core';
import { Lightning, Point, Tendency, RND } from '../models/lightning.model'
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LightningService {
  lightning: Lightning[] = []
  constructor() { }

  getLightnings(): Observable<Lightning[]> {
    return of(this.lightning);
  }
}
