import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {SoundManager} from '../../services/sound.manager';
import {Song} from '../../models/song.interface';
import {takeUntil} from 'rxjs/operators';
import {ShowToastrService} from '../../services/show-toastr.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  currentSong: Song;
  currentTime = '00:00';

  private ngDestroy$: Subject<boolean> = new Subject();

  constructor(private songManager: SoundManager, private toastr: ShowToastrService) {}

  ngOnInit() {
    this.subscribeToSong();
  }

  subscribeToSong() {
    this.songManager.currentSong$
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(
        (res: Song) => {
          this.currentSong = res;
        },
        error => {
          this.toastr.showError('Could not set a new song', error);
        }
      );

    this.songManager.currentTime$
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(
        (res: string) => {
          this.currentTime = res;
        },
        error => {
          this.toastr.showError('Could not set the time of a new song', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }
}
