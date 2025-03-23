import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
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
export class ArtistListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselWrapper') carouselWrapper!: ElementRef;
  @ViewChild('artistCarousel') artistCarousel!: ElementRef;
  
  artists: Artist[] = [];
  clonedArtistsStart: Artist[] = []; // Primeros elementos clonados al final
  clonedArtistsEnd: Artist[] = []; // Últimos elementos clonados al inicio
  loading = false;
  error = '';
  
  private autoScrollInterval: any;
  private scrollAmount = 1; // píxeles por intervalo
  private scrollIntervalTime = 30; // milisegundos entre cada desplazamiento
  private isMobile = false;
  private cloneCount = 3; // Número de elementos a clonar en cada extremo
  private isTransitioning = false;

  constructor(private artistService: ArtistService) { }

  ngOnInit(): void {
    this.loadArtists();
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

  loadArtists(): void {
    this.loading = true;
    this.artistService.getAllArtists().subscribe({
      next: (artists) => {
        this.artists = artists;
        this.createClones();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load artists';
        this.loading = false;
        console.error(err);
      }
    });
  }

  createClones(): void {
    if (this.artists.length === 0) return;
    
    // Clonar los primeros elementos para colocarlos al final
    this.clonedArtistsStart = this.artists.slice(0, Math.min(this.cloneCount, this.artists.length));
    
    // Clonar los últimos elementos para colocarlos al inicio
    this.clonedArtistsEnd = this.artists.slice(
      Math.max(0, this.artists.length - this.cloneCount), 
      this.artists.length
    );
  }

  initInfiniteScroll(): void {
    if (!this.carouselWrapper || this.isMobile) return;
    
    const wrapper = this.carouselWrapper.nativeElement;
    
    // Posicionar el scroll inicialmente en el primer elemento real (después de los clones)
    setTimeout(() => {
      const cardWidth = 280; // Ancho de cada tarjeta
      const gapWidth = 20; // Espacio entre tarjetas
      const initialScrollPosition = this.clonedArtistsEnd.length * (cardWidth + gapWidth);
      wrapper.scrollLeft = initialScrollPosition;
    }, 10);
    
    // Detectar cuando el scroll llega a los extremos para reposicionar
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
          const resetPosition = this.clonedArtistsEnd.length * (cardWidth + gapWidth);
          wrapper.scrollLeft = resetPosition;
          
          setTimeout(() => {
            wrapper.style.scrollBehavior = 'smooth';
            this.isTransitioning = false;
          }, 100);
        }, 200);
      }
      
      // Si llegamos al inicio (clones del final)
      else if (scrollPosition <= 10) {
        this.isTransitioning = true;
        // Volver al final real sin animación
        setTimeout(() => {
          wrapper.style.scrollBehavior = 'auto';
          const cardWidth = 280;
          const gapWidth = 20;
          const resetPosition = (this.clonedArtistsEnd.length + this.artists.length) * (cardWidth + gapWidth) - containerWidth;
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
      if (!this.carouselWrapper || !this.artistCarousel || this.isTransitioning) return;
      
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
    
    this.pauseAutoScroll(); // Pausar el desplazamiento automático al hacer clic
    
    const wrapper = this.carouselWrapper.nativeElement;
    const cardWidth = 280; // Ancho de cada tarjeta
    const gapWidth = 20; // Espacio entre tarjetas
    
    // Desplazar por un número fijo de tarjetas en lugar de un porcentaje
    const scrollDistance = direction * (cardWidth + gapWidth) * 2; // Desplazar 2 tarjetas a la vez
    
    wrapper.scrollBy({
      left: scrollDistance,
      behavior: 'smooth'
    });
    
    // Reanudar el desplazamiento automático después de un tiempo
    setTimeout(() => {
      this.resumeAutoScroll();
    }, 1000);
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth < 768;
    
    if (this.isMobile) {
      this.stopAutoScroll();
    } else if (this.artists.length > 0 && !this.autoScrollInterval) {
      this.initInfiniteScroll();
      this.startAutoScroll();
    }
  }
}