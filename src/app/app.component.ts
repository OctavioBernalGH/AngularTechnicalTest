import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SongListComponent } from './components/song-list/song-list.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { CompanyListComponent } from './components/company-list/company-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, SongListComponent, ArtistListComponent, CompanyListComponent],
  standalone: true
})
export class AppComponent {
  title = 'Music Database';
}
