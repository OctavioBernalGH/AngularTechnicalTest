import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SongService } from './services/song.service';
import { ArtistService } from './services/artist.service';
import { CompanyService } from './services/company.service';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppComponent 
  ],
  providers: [
    SongService,
    ArtistService,
    CompanyService
  ],

})
export class AppModule { }