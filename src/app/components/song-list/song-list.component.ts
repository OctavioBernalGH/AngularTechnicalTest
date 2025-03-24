import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Song } from '../../models/song.model';
import { SongService } from '../../services/song.service';
import { Artist } from '../../models/artist.model';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class SongListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselWrapper') carouselWrapper!: ElementRef;
  @ViewChild('songCarousel') songCarousel!: ElementRef;
  
  songs: Song[] = [];
  clonedSongsStart: Song[] = [];
  clonedSongsEnd: Song[] = [];
  loading = false;
  error = '';
  
  private autoScrollInterval: any;
  private scrollAmount = 1; 
  private scrollIntervalTime = 30;
  private isMobile = false;
  private cloneCount = 3;
  private isTransitioning = false;

  showEditModal = false;
  songForm!: FormGroup;
  currentSongId: number | null = null;
  selectedGenres: string[] = [];
  availableGenres: string[] = [
    'Pop', 'Rock', 'Alternative', 'Blues', 'Heavy', 'Chill', 
    'Romance', 'Psychedelic rock', 'Jazz', 'Classical', 'Electronic'
  ];
  genreError = false;

  ngOnInit(): void {
    this.loadSongs();
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
    this.initForm();
  }

  ngAfterViewInit(): void {
    if (!this.isMobile) {
      setTimeout(() => {
        this.initInfiniteScroll();
        this.startAutoScroll();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
    window.removeEventListener('resize', this.checkIfMobile.bind(this));
  }

  loadSongs(): void {
    this.loading = true;
    this.songService.getAllSongs().subscribe({
      next: (songs) => {
        this.songs = songs;
        this.createClones();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load songs';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createClones(): void {
    if (this.songs.length === 0) return;
    
    this.clonedSongsStart = this.songs.slice(0, Math.min(this.cloneCount, this.songs.length));
    
    this.clonedSongsEnd = this.songs.slice(
      Math.max(0, this.songs.length - this.cloneCount), 
      this.songs.length
    );
  }

  initInfiniteScroll(): void {
    if (!this.carouselWrapper || this.isMobile) return;
    
    const wrapper = this.carouselWrapper.nativeElement;
    
    setTimeout(() => {
      const cardWidth = 280;
      const gapWidth = 20;
      const initialScrollPosition = this.clonedSongsEnd.length * (cardWidth + gapWidth);
      wrapper.scrollLeft = initialScrollPosition;
    }, 10);
    
    wrapper.addEventListener('scroll', () => {
      if (this.isTransitioning) return;
      
      const totalWidth = wrapper.scrollWidth;
      const containerWidth = wrapper.clientWidth;
      const scrollPosition = wrapper.scrollLeft;
      
      // Si llegamos al final (clones del inicio)
      if (scrollPosition + containerWidth >= totalWidth - 10) {
        this.isTransitioning = true;
        // Volver al inicio real sin animación
        setTimeout(() => {
          wrapper.style.scrollBehavior = 'auto';
          const cardWidth = 280;
          const gapWidth = 20;
          const resetPosition = this.clonedSongsEnd.length * (cardWidth + gapWidth);
          wrapper.scrollLeft = resetPosition;
          
          setTimeout(() => {
            wrapper.style.scrollBehavior = 'smooth';
            this.isTransitioning = false;
          }, 100);
        }, 200);
      }
      
      else if (scrollPosition <= 10) {
        this.isTransitioning = true;
        setTimeout(() => {
          wrapper.style.scrollBehavior = 'auto';
          const cardWidth = 280;
          const gapWidth = 20;
          const resetPosition = (this.clonedSongsEnd.length + this.songs.length) * (cardWidth + gapWidth) - containerWidth;
          wrapper.scrollLeft = resetPosition;
          
          setTimeout(() => {
            wrapper.style.scrollBehavior = 'smooth';
            this.isTransitioning = false;
          }, 100);
        }, 200);
      }
    });
  }

  startAutoScroll(): void {
    if (this.isMobile) return;
    
    this.stopAutoScroll();
    this.autoScrollInterval = setInterval(() => {
      if (!this.carouselWrapper || !this.songCarousel || this.isTransitioning) return;
      
      const wrapper = this.carouselWrapper.nativeElement;
      wrapper.scrollLeft += this.scrollAmount;
    }, this.scrollIntervalTime);
  }

  stopAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  pauseAutoScroll(): void {
    this.stopAutoScroll();
  }

  resumeAutoScroll(): void {
    this.startAutoScroll();
  }

  scrollCarousel(direction: number): void {
    if (!this.carouselWrapper || this.isTransitioning) return;
    
    this.pauseAutoScroll(); 
    
    const wrapper = this.carouselWrapper.nativeElement;
    const cardWidth = 280;
    const gapWidth = 20;
    const scrollDistance = direction * (cardWidth + gapWidth) * 2; 
    
    wrapper.scrollBy({
      left: scrollDistance,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      this.resumeAutoScroll();
    }, 1000);
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth < 768;
    
    if (this.isMobile) {
      this.stopAutoScroll();
    } else if (this.songs.length > 0 && !this.autoScrollInterval) {
      this.initInfiniteScroll();
      this.startAutoScroll();
    }
  }

  initForm(): void {
    this.songForm = this.fb.group({
      title: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      duration: ['', [Validators.required, Validators.min(1)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      poster: ['']
    });
  }

  openEditModal(song: Song): void {
    this.pauseAutoScroll();
    this.currentSongId = song.id;
    this.selectedGenres = [...song.genre];
    
    this.songForm.setValue({
      title: song.title,
      year: song.year,
      duration: song.duration,
      rating: song.rating,
      poster: song.poster || ''
    });
    
    this.showEditModal = true;
  }

  closeModal(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.showEditModal = false;
    this.currentSongId = null;
    this.selectedGenres = [];
    this.genreError = false;
    this.resumeAutoScroll();
  }

  onGenreChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const genre = checkbox.value;
    
    if (checkbox.checked) {
      if (!this.selectedGenres.includes(genre)) {
        this.selectedGenres.push(genre);
      }
    } else {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    }
  }

  showSuccessModal = false;
  
  saveSong(): void {
    if (this.songForm.invalid || !this.currentSongId) {
      Object.keys(this.songForm.controls).forEach(key => {
        const control = this.songForm.get(key);
        control?.markAsTouched();
      });
      
      if (this.selectedGenres.length === 0) {
        this.genreError = true;
      }
      
      return;
    }
    
    if (this.selectedGenres.length === 0) {
      this.genreError = true;
      return;
    }
    
    const updatedSong: Song = {
      id: this.currentSongId,
      ...this.songForm.value,
      genre: this.selectedGenres,
      artist: this.songs.find(s => s.id === this.currentSongId)?.artist || 0
    };
    
    this.songService.updateSong(updatedSong).subscribe({
      next: () => {
        this.closeModal();
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error('Error updating song:', err);
      }
    });
  }
  
  reloadPage(): void {
    window.location.reload();
  }

  // Añadir estas propiedades
  showDeleteConfirmModal = false;
  showDeleteSuccessModal = false;
  songToDeleteId: number | null = null;
  
  // Reemplazar el método deleteSong existente
  deleteSong(id: number): void {
    this.pauseAutoScroll();
    this.songToDeleteId = id;
    this.showDeleteConfirmModal = true;
  }
  
  // Añadir estos nuevos métodos
  cancelDelete(): void {
    this.showDeleteConfirmModal = false;
    this.songToDeleteId = null;
    this.resumeAutoScroll();
  }
  
  confirmDelete(): void {
    if (!this.songToDeleteId) return;
    
    this.songService.deleteSong(this.songToDeleteId).subscribe({
      next: () => {
        this.showDeleteConfirmModal = false;
        this.showDeleteSuccessModal = true;
      },
      error: (err) => {
        console.error('Error deleting song:', err);
        this.showDeleteConfirmModal = false;
        this.resumeAutoScroll();
      }
    });
  }
  
  // Añadir estas propiedades
  showInfoModal = false;
  selectedSong: Song | null = null;
  selectedArtist: Artist | null = null;
  
  // Modificar el constructor para inyectar el servicio de artistas
  constructor(
    private songService: SongService,
    private artistService: ArtistService,
    private fb: FormBuilder
  ) { }
  
  // Modificar el método openInfoModal
  openInfoModal(song: Song): void {
    this.pauseAutoScroll();
    this.selectedSong = song;
    this.showInfoModal = true;
    
    // Fetch artist information
    if (song.artist) {
      this.artistService.getArtistById(song.artist).subscribe({
        next: (artist) => {
          this.selectedArtist = artist;
        },
        error: (err) => {
          console.error('Error loading artist:', err);
          this.selectedArtist = null;
        }
      });
    } else {
      this.selectedArtist = null;
    }
  }
  
  // Modificar el método closeInfoModal
  closeInfoModal(): void {
    this.showInfoModal = false;
    this.selectedSong = null;
    this.selectedArtist = null;
    this.resumeAutoScroll();
  }
  
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}