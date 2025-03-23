import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SongService } from './services/song.service';
import { ArtistService } from './services/artist.service';
import { CompanyService } from './services/company.service';
import { SongListComponent } from './components/song-list/song-list.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppComponent,
    SongListComponent,
    ArtistListComponent
  ],
  providers: [
    SongService,
    ArtistService,
    CompanyService
  ],

})
export class AppModule { }