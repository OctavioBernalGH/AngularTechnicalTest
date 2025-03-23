import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  loading = false;
  error = '';

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyService.getAllCompanies().subscribe({
      next: (companies) => {
        // Ordenar compañías por rating de forma descendente
        this.companies = companies.sort((a, b) => b.rating - a.rating);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load companies';
        this.loading = false;
        console.error(err);
      }
    });
  }
}