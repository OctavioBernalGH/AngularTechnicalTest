import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:3000/companies';

  constructor(private http: HttpClient) { }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  getCompaniesByCountry(country: string): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}?country=${country}`);
  }

  getTopRatedCompanies(minRating: number): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}?rating_gte=${minRating}`);
  }
}