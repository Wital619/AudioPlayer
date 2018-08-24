import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {LoadingModule} from 'ngx-loading';
import {ToastrModule} from 'ngx-toastr';

import {AppComponent} from './app.component';
import {SongListComponent} from './components/song-list/song-list.component';
import {SongItemComponent} from './components/song-item/song-item.component';
import {AudioPlayerComponent} from './components/audio-player/audio-player.component';
import {AudioControlsComponent} from './components/audio-controls/audio-controls.component';
import {AudioSliderComponent} from './components/audio-slider/audio-slider.component';
import {VolumeChangerComponent} from './components/volume-changer/volume-changer.component';

import {SoundManager} from './services/sound.manager';
import {VolumeManager} from './services/volume.manager';
import {ShowToastrService} from './services/show-toastr.service';

@NgModule({
  declarations: [
    AppComponent,
    SongListComponent,
    SongItemComponent,
    AudioPlayerComponent,
    AudioControlsComponent,
    AudioSliderComponent,
    VolumeChangerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LoadingModule,
    ToastrModule.forRoot()
  ],
  providers: [
    SoundManager,
    VolumeManager,
    ShowToastrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
