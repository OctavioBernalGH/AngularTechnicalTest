import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = 'http://localhost:3000/artists';

  constructor(private http: HttpClient) { }

  getAllArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.apiUrl);
  }

  getArtistById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/${id}`);
  }

  getArtistsByCity(city: string): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}?bornCity=${city}`);
  }

  // Nuevos métodos para CRUD
  createArtist(artist: Artist): Observable<Artist> {
    return this.http.post<Artist>(this.apiUrl, artist);
  }

  updateArtist(artist: Artist): Observable<Artist> {
    return this.http.put<Artist>(`${this.apiUrl}/${artist.id}`, artist);
  }

  deleteArtist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}