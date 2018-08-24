import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {SoundManager} from '../../services/sound.manager';
import {Song} from '../../models/song.interface';
import {ShowToastrService} from '../../services/show-toastr.service';

@Component({
  selector: 'app-audio-slider',
  templateUrl: './audio-slider.component.html',
  styleUrls: ['./audio-slider.component.scss'],
})
export class AudioSliderComponent implements OnInit {
  @ViewChild('audioSlider') audioSlider: ElementRef;
  @Input() currentSong: Song;

  constructor(private songManager: SoundManager,
              private renderer: Renderer2,
              private toastr: ShowToastrService) {}

  ngOnInit() {
    if (this.audioSlider.nativeElement.offsetParent.className) {
      this.songManager.currentPercent$
        .subscribe(
          (res: number) => {
            this.setSliderWidth(res);
          },
          error => {
            this.toastr.showError('Could not get and set slider width', error);
          }
        );
    } else {
      Object.defineProperty(this.currentSong, 'currentPercent', {
        set: (value) => {
          this.setSliderWidth(value);
        }
      });
    }
  }

  setSelectedTime(event) {
    if (!this.currentSong) {
      return;
    }

    const that = this;
    if (this.currentSong === this.songManager.getLastSong()) {
      setSelectedTime();
    } else {
      new Promise((resolve, reject) => {
        this.songManager.setSong(this.currentSong);
        this.songManager.setPlayOrPause();

        this.songManager.getAudio().oncanplaythrough = () => {
          resolve();
        };

        setTimeout(() => {
          reject();
        }, 5000);
      })
      .then(() => {
        setSelectedTime();
      })
      .catch(error => {
        this.toastr.showError('Song download time exceeded (5 seconds)', error);
      });
    }

    function setSelectedTime() {
      const selectedWidthPercent = (100 * +event.layerX) / that.audioSlider.nativeElement.clientWidth;
      const selectedTime = (that.songManager.getAudio().duration * selectedWidthPercent) / 100;
      that.songManager.setSelectedTime(selectedTime);
    }
  }

  setSliderWidth(res: number): void {
    this.renderer.setStyle(
      this.audioSlider.nativeElement.children[0],
      'width',
      `${(this.audioSlider.nativeElement.clientWidth * res) / 100}px`,
    );
  }
}
