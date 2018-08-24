import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, fromEvent, merge, Observable, of, Subject} from 'rxjs';

import {Song} from '../models/song.interface';
import {switchMap} from 'rxjs/operators';
import {ShowToastrService} from './show-toastr.service';

@Injectable()
export class SoundManager {
  private audio: HTMLAudioElement;
  private playlist: Song[] = [];

  private currentPercentSource: Subject<number> = new Subject();
  private currentSongSource: BehaviorSubject<Song> = new BehaviorSubject(null);
  private currentTimeSource: Subject<string> = new Subject();
  private playerStatusSource: BehaviorSubject<string> = new BehaviorSubject('paused');

  readonly currentPercent$ = this.currentPercentSource.asObservable();
  readonly currentSong$ = this.currentSongSource.asObservable();
  readonly currentTime$ = this.currentTimeSource.asObservable();
  readonly playerStatus$ = this.playerStatusSource.asObservable();

  constructor(private http: HttpClient, private showToastr: ShowToastrService) {
    this.audio = new Audio();
    this.attachListeners();
    this.subscribeToSong();
  }

  getAudio(): HTMLAudioElement {
    return this.audio;
  }

  getLastSong(): Song {
    return this.currentSongSource.value;
  }

  getPlayList(): Observable<any> {
    return this.http.get('../assets/songs.json');
  }

  nextSong(): void {
    let index = this.playlist.indexOf(this.getLastSong());

    if (index < this.playlist.length - 1) {
      index++;
    } else {
      index = 0;
    }

    this.setSong(this.playlist[index]);
    this.setPlayOrPause();
  }

  pauseAudio(song: Song): void {
    this.audio.pause();
    song.isPlaying = false;
  }

  playAudio(song: Song): void {
    if (song !== this.getLastSong()) {
      this.setSong(song);
    }

    const play = this.audio.play();
    if (play !== undefined) {
      play.then(() => {
        song.isPlaying = true;
      })
      .catch(error => {
        this.showToastr.showError('Could not load the song', error);
        song.isPlaying = false;
      });
    }
  }

  previousSong(): void {
    let index = this.playlist.indexOf(this.getLastSong());

    if (index > 0) {
      index--;
    } else {
      index = this.playlist.length - 1;
    }

    this.setSong(this.playlist[index]);
    this.setPlayOrPause();
  }

  setPlayList(playlist: Song[]): void {
    this.playlist = playlist;
  }

  setPlayOrPause(): void {
    const currentSong = this.getLastSong();

    switch (this.playerStatusSource.value) {
      case 'playing':
      case 'ended':
        const play = this.audio.play();

        if (play !== undefined) {
          play.then(() => {
            currentSong.isPlaying = true;
          })
          .catch(error => {
            this.showToastr.showError('Could not load the song', error);
            currentSong.isPlaying = false;
          });
        }
        break;
      default:
        this.audio.pause();
        currentSong.isPlaying = false;
    }
  }

  setSelectedTime(timePosition: number): void {
    this.audio.currentTime = timePosition;
  }

  setSong(song: Song): void {
    if (this.getLastSong()) {
      this.clearLastSong();
    }

    this.currentSongSource.next(song);
    this.audio.src = song.link;
    this.audio.load();
  }

  private attachListeners(): void {
    const onTimeUpdate$ = fromEvent(this.audio, 'timeupdate');
    const onPlaying$ = fromEvent(this.audio, 'playing');
    const onPause$ = fromEvent(this.audio, 'pause');
    const onEnded$ = fromEvent(this.audio, 'ended');

    onTimeUpdate$.subscribe(
        () => {
          this.setTimeAndPercent();
        },
        error => this.showToastr.showError('Could not get the time and percent of the current song', error)
      );

    merge(onPlaying$, onPause$, onEnded$)
      .subscribe(
        event => this.setPlayerStatus(event),
        error => this.showToastr.showError('Could not get the status of the current song', error)
      );
  }

  private clearLastSong(): void {
    const lastSong = this.getLastSong();
    lastSong.currentTime = '';
    lastSong.isPlaying = false;
    lastSong.currentPercent = 0;
  }

  private setPlayerStatus(event): void {
    switch (event.type) {
      case 'playing':
        this.playerStatusSource.next('playing');
        break;
      case 'ended':
        this.playerStatusSource.next('ended');
        break;
      case 'paused':
      default:
        this.playerStatusSource.next('paused');
        break;
    }
  }

  private setTimeAndPercent(): void {
    const time = this.audio.currentTime;

    this.currentTimeSource.next(this.getFormattedTime(time));
    this.currentPercentSource.next((100 / this.audio.duration) * time || 0);
  }

  private subscribeToSong(): void {
    this.currentSong$
      .pipe(
        switchMap((song: Song) => {
          return combineLatest(of(song), this.currentTime$, this.currentPercent$);
        })
      )
      .subscribe(
        ([song, time, percent]) => {
          song.currentTime = time;
          song.currentPercent = percent;
        },
        error => this.showToastr.showError('Could not set a new song', error)
      );
  }

  private getFormattedTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    const displayMinutes = minutes > 9 ? minutes.toString() : `0${minutes.toString()}`;
    const displaySeconds = seconds > 9 ? seconds.toString() : `0${seconds.toString()}`;

    return `${displayMinutes}:${displaySeconds}`;
  }
}
