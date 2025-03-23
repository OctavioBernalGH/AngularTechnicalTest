import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SongService } from './song.service';
import { Song } from '../models/song.model';

describe('SongService', () => {
  let service: SongService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SongService]
    });
    service = TestBed.inject(SongService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all songs', () => {
    const mockSongs: Song[] = [
      {
        id: 1,
        title: "Who did you think i was",
        poster: "http://dummyimage.com/400x600.png/cc0000/ffffff",
        genre: ["Pop", "Rock", "Alternative"],
        year: 2007,
        duration: 424,
        rating: 9.27,
        artist: 1
      }
    ];

    service.getAllSongs().subscribe(songs => {
      expect(songs.length).toBe(1);
      expect(songs).toEqual(mockSongs);
    });

    const req = httpMock.expectOne('http://localhost:3000/songs');
    expect(req.request.method).toBe('GET');
    req.flush(mockSongs);
  });

  it('should get a song by id', () => {
    const mockSong: Song = {
      id: 1,
      title: "Who did you think i was",
      poster: "http://dummyimage.com/400x600.png/cc0000/ffffff",
      genre: ["Pop", "Rock", "Alternative"],
      year: 2007,
      duration: 424,
      rating: 9.27,
      artist: 1
    };

    service.getSongById(1).subscribe(song => {
      expect(song).toEqual(mockSong);
    });

    const req = httpMock.expectOne('http://localhost:3000/songs/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSong);
  });

  it('should get songs by artist id', () => {
    const mockSongs: Song[] = [
      {
        id: 1,
        title: "Who did you think i was",
        poster: "http://dummyimage.com/400x600.png/cc0000/ffffff",
        genre: ["Pop", "Rock", "Alternative"],
        year: 2007,
        duration: 424,
        rating: 9.27,
        artist: 1
      }
    ];

    service.getSongsByArtistId(1).subscribe(songs => {
      expect(songs.length).toBe(1);
      expect(songs).toEqual(mockSongs);
    });

    const req = httpMock.expectOne('http://localhost:3000/songs?artist=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSongs);
  });

  it('should get songs by genre', () => {
    const mockSongs: Song[] = [
      {
        id: 1,
        title: "Who did you think i was",
        poster: "http://dummyimage.com/400x600.png/cc0000/ffffff",
        genre: ["Pop", "Rock", "Alternative"],
        year: 2007,
        duration: 424,
        rating: 9.27,
        artist: 1
      }
    ];

    service.getSongsByGenre('Rock').subscribe(songs => {
      expect(songs.length).toBe(1);
      expect(songs).toEqual(mockSongs);
    });

    const req = httpMock.expectOne('http://localhost:3000/songs?genre_like=Rock');
    expect(req.request.method).toBe('GET');
    req.flush(mockSongs);
  });
});