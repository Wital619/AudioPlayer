import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {VolumeManager} from '../../services/volume.manager';
import {ShowToastrService} from '../../services/show-toastr.service';

@Component({
  selector: 'app-volume-changer',
  templateUrl: './volume-changer.component.html',
  styleUrls: ['./volume-changer.component.scss'],
})
export class VolumeChangerComponent implements OnInit, OnDestroy {
  @Input() iconSize: string;
  @ViewChild('volumeIcon') volumeIcon: ElementRef;

  sliderPosition: number;
  sliderPositionSub: Subscription;

  constructor(private volumeManager: VolumeManager,
              private renderer: Renderer2,
              private toastr: ShowToastrService) {}

  ngOnInit() {
    this.sliderPositionSub = this.volumeManager.sliderPosition$
      .subscribe(
        (res: number) => {
          this.sliderPosition = res;
        },
        error => {
          this.toastr.showError('Could not set the volume', error);
        }
      );

    this.renderer.setStyle(this.volumeIcon.nativeElement, 'width', this.iconSize);
    this.renderer.setStyle(this.volumeIcon.nativeElement, 'height', this.iconSize);
  }

  setVolume(event): void {
    this.volumeManager.setVolume(event.target.value);
  }

  ngOnDestroy() {
    this.sliderPositionSub.unsubscribe();
  }
}
