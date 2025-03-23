import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'http://localhost:3000/songs';

  constructor(private http: HttpClient) { }

  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl);
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/${id}`);
  }

  getSongsByArtistId(artistId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}?artist=${artistId}`);
  }

  getSongsByGenre(genre: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}?genre_like=${genre}`);
  }
}