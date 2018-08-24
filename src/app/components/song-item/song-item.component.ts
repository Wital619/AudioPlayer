import {Component, Input} from '@angular/core';
import {Song} from '../../models/song.interface';
import {SoundManager} from '../../services/sound.manager';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss'],
})
export class SongItemComponent {
  @Input() song: Song;

  constructor(private songManager: SoundManager) {}

  pause() {
    this.songManager.pauseAudio(this.song);
  }

  play() {
    this.songManager.playAudio(this.song);
  }
}
