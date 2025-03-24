import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SongListComponent } from "./components/song-list/song-list.component";
import { ArtistListComponent } from "./components/artist-list/artist-list.component";
import { CompanyListComponent } from "./components/company-list/company-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    TranslateModule,
    SongListComponent, 
    ArtistListComponent, 
    CompanyListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularTechnicalTest';
  
  constructor(private translate: TranslateService) {
    // Set default language
    translate.setDefaultLang('en');
    
    // Use browser language if available, otherwise use default
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/en|es/) ? browserLang : 'en');
  }
  
  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
