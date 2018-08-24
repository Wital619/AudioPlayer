import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SoundManager} from '../../services/sound.manager';
import {Song} from '../../models/song.interface';
import {ShowToastrService} from '../../services/show-toastr.service';

@Component({
  selector: 'app-audio-controls',
  templateUrl: './audio-controls.component.html',
  styleUrls: ['./audio-controls.component.scss'],
})
export class AudioControlsComponent implements OnInit, OnDestroy {
  @Input() currentSong: Song;
  isPlaying: boolean;
  playerStatusSub: Subscription;

  constructor(private songManager: SoundManager, private toastr: ShowToastrService) {}

  ngOnInit() {
    this.playerStatusSub = this.songManager.playerStatus$
      .subscribe(
        (res: string) => {
          switch (res) {
            case 'playing':
              this.isPlaying = true;
              break;
            case 'paused':
              this.isPlaying = false;
              break;
            case 'ended':
              this.nextSong();
              break;
            default:
              this.isPlaying = false;
              break;
          }
        },
        error => {
          this.toastr.showError('Could not get the status of the current song');
          console.log(error);
        }
      );
  }

  nextSong(): void {
    this.songManager.nextSong();
  }

  pause(): void {
    this.songManager.pauseAudio(this.currentSong);
  }

  play(): void {
    this.songManager.playAudio(this.currentSong);
  }

  previousSong(): void {
    this.songManager.previousSong();
  }

  ngOnDestroy() {
    this.playerStatusSub.unsubscribe();
  }
}
