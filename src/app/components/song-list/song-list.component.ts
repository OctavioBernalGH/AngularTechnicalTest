import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../models/song.model';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
  standalone: true,
  imports: [CommonModule]
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

  constructor(private songService: SongService) { }

  ngOnInit(): void {
    this.loadSongs();
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
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
}