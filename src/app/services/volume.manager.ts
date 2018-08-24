import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

import {SoundManager} from './sound.manager';
import {startWith} from 'rxjs/operators';

@Injectable()
export class VolumeManager {
  private sliderPositionSource: Subject<number> = new Subject();
  sliderPosition$: Observable<number> = this.sliderPositionSource.asObservable().pipe(startWith(0.0));

  constructor(private songManager: SoundManager) {
    this.setCurrentVolume(0.0);
  }

  private setCurrentVolume(volume: number): void {
    this.songManager.getAudio().volume = volume;
  }

  public setVolume(volume: string): void {
    const volumeNum = parseFloat(volume);

    this.sliderPositionSource.next(volumeNum);
    this.setCurrentVolume(volumeNum);
  }
}
