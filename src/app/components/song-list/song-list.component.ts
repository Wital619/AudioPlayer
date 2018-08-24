import { Component, OnInit } from '@angular/core';
import {Song} from '../../models/song.interface';
import {SoundManager} from '../../services/sound.manager';
import {ShowToastrService} from '../../services/show-toastr.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  loading = false;
  songs: Song[] = [];

  constructor(public songManager: SoundManager, private toastr: ShowToastrService) {}

  ngOnInit() {
    this.getPlayList();
  }

  initSongs(songs: Song[]): void {
    songs.forEach((song: Song) => {
      song.isPlaying = false;
      song.currentTime = '';
      song.currentPercent = 0;
    });

    this.songs = songs;
    this.songManager.setPlayList(songs);
  }

  getPlayList(): void {
    this.loading = true;
    this.songManager.getPlayList()
      .subscribe(
        (res: Song[]) => {
          this.initSongs(res);
          this.loading = false;
        },
        error => {
          this.toastr.showError('Could not load songs', error);
          this.loading = false;
        }
      );
  }
}
