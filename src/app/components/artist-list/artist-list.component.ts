import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../models/artist.model';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ArtistListComponent implements OnInit {
  artists: Artist[] = [];
  loading = false;
  error = '';

  constructor(private artistService: ArtistService) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.loading = true;
    this.artistService.getAllArtists().subscribe({
      next: (artists) => {
        this.artists = artists;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load artists';
        this.loading = false;
        console.error(err);
      }
    });
  }
}