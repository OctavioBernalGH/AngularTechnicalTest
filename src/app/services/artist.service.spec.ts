import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArtistService } from './artist.service';
import { Artist } from '../models/artist.model';

describe('ArtistService', () => {
  let service: ArtistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArtistService]
    });
    service = TestBed.inject(ArtistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all artists', () => {
    const mockArtists: Artist[] = [
      {
        id: 1,
        name: "John Mayer",
        bornCity: "Conecticut",
        birthdate: "16/10/1977",
        img: "http://dummyimage.com/600x400.png/dddddd/000000",
        rating: 9.03,
        songs: [1, 6]
      }
    ];

    service.getAllArtists().subscribe(artists => {
      expect(artists.length).toBe(1);
      expect(artists).toEqual(mockArtists);
    });

    const req = httpMock.expectOne('http://localhost:3000/artists');
    expect(req.request.method).toBe('GET');
    req.flush(mockArtists);
  });

  it('should get an artist by id', () => {
    const mockArtist: Artist = {
      id: 1,
      name: "John Mayer",
      bornCity: "Conecticut",
      birthdate: "16/10/1977",
      img: "http://dummyimage.com/600x400.png/dddddd/000000",
      rating: 9.03,
      songs: [1, 6]
    };

    service.getArtistById(1).subscribe(artist => {
      expect(artist).toEqual(mockArtist);
    });

    const req = httpMock.expectOne('http://localhost:3000/artists/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockArtist);
  });

  it('should get artists by city', () => {
    const mockArtists: Artist[] = [
      {
        id: 3,
        name: "John Lennon",
        bornCity: "Liverpool",
        birthdate: "10/04/1986",
        img: null,
        rating: 7.92,
        songs: [2, 3, 8]
      }
    ];

    service.getArtistsByCity('Liverpool').subscribe(artists => {
      expect(artists.length).toBe(1);
      expect(artists).toEqual(mockArtists);
    });

    const req = httpMock.expectOne('http://localhost:3000/artists?bornCity=Liverpool');
    expect(req.request.method).toBe('GET');
    req.flush(mockArtists);
  });
});